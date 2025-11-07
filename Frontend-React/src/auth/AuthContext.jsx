import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import type { SessionUser } from '../types'

type AuthState = {
  user: SessionUser | null
  token: string | null
  login: (username: string, password: string) => Promise<void>
  register: (email: string, password: string, username?: string) => Promise<void>
  logout: () => void
}

const AuthCtx = createContext<AuthState | undefined>(undefined)

// Helpers
const safeParseJSON = <T,>(raw: string | null): T | null => {
  if (!raw) return null
  try {
    const t = raw.trim()
    if (!t || t === 'undefined' || t === 'null') return null
    return JSON.parse(t) as T
  } catch { return null }
}

const extractToken = (data: any): string | null =>
  data?.token ?? data?.access_token ?? data?.jwt ?? null

// Normaliza el user desde distintas formas comunes
const normalizeFromLogin = (data: any, fallbackUsername?: string): SessionUser => {
  const u =
    data?.user ??
    data?.profile ??
    data?.account ??
    data // a veces el login devuelve el user plano + token aparte

  const id =
    u?.id ?? u?._id ?? u?.user_id ?? u?.sub ?? u?.uuid ?? fallbackUsername ?? 'me'

  const emailLike =
    u?.email ?? u?.username ?? u?.name ?? fallbackUsername ?? 'user'

  // Detección de admin: usa banderas comunes o strings de rol
  const isAdmin =
    u?.is_superuser === true ||
    u?.isAdmin === true ||
    u?.is_admin === true ||
    (typeof u?.role === 'string' && String(u.role).toLowerCase() === 'admin')

  const role = isAdmin ? 'admin' : 'user'

  return { id, email: String(emailLike), role }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Hidratar desde localStorage
  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = safeParseJSON<SessionUser>(localStorage.getItem('user'))
    if (t) setToken(t)
    if (u) setUser(u)
  }, [])

  // LOGIN (form-urlencoded username/password). NO usamos /auth/me.
  const login = async (username: string, password: string) => {
    const form = new URLSearchParams()
    form.append('username', username)
    form.append('password', password)

    const { data } = await api.post('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    const tk = extractToken(data)
    if (tk) {
      localStorage.setItem('token', tk)
      setToken(tk)
    }

    // Armamos el user usando lo que venga del login (incl. is_superuser si existe)
    const normalized = normalizeFromLogin(data, username)
    localStorage.setItem('user', JSON.stringify(normalized))
    setUser(normalized)
  }

  // REGISTER (JSON: { username, email, password })
  const register = async (email: string, password: string, username?: string) => {
    const uname = (username && username.trim())
      ? username.trim()
      : (email.includes('@') ? email.split('@')[0] : email)

    await api.post('/auth/register', { username: uname, email, password })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
