// src/auth/ProtectedRoute.tsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { Role } from '../types'

type Props = {
  children: React.ReactNode
  roles?: Role[]
}

/**
 * - Evita redirecciones en bucle leyendo token también de localStorage.
 * - Si hay token pero el user aún no está hidrato, dejamos pasar (o podrías poner un spinner).
 * - Role guard opcional.
 */
export const ProtectedRoute: React.FC<Props> = ({ children, roles }) => {
  const { user, token } = useAuth()
  const location = useLocation()

  // Revisa token “persistido” para no redirigir mientras hidrata
  const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const effectiveToken = token || storedToken

  // 1) Si no hay token en ningún lado, manda a login
  if (!effectiveToken) {
    // evita intentar navegar al mismo sitio
    if (location.pathname !== '/login') {
      return <Navigate to="/login" replace state={{ from: location.pathname }} />
    }
    return <></>
  }

  // 2) Si hay token pero user todavía no está listo, permite renderizar children
  // (alternativa: mostrar un loader)
  if (!user) {
    return <>{children}</>
  }

  // 3) Si hay restricción de roles y no coincide, manda al home
  if (roles && !roles.includes(user.role)) {
    if (location.pathname !== '/') {
      return <Navigate to="/" replace />
    }
    return <></>
  }

  // 4) Autorizado
  return <>{children}</>
}

export default ProtectedRoute
