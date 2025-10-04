import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const Register: React.FC = () => {
  const { register: doRegister } = useAuth()
  const nav = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [ok, setOk] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isValidEmail = (v: string) => /\S+@\S+\.\S+/.test(v)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setOk(null)

    if (!username.trim()) {
      setError('Username es requerido'); return
    }
    if (!isValidEmail(email)) {
      setError('Email no es válido'); return
    }
    if (!password.trim()) {
      setError('Contraseña es requerida'); return
    }

    setLoading(true)
    try {
      await doRegister(email.trim(), password, username.trim())
      setOk('Registro exitoso. Ahora inicia sesión.')
      setTimeout(() => nav('/login'), 700)
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        'No se pudo registrar'
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Crear cuenta</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Username</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="usuario123"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="usuario@correo.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {ok && <p className="text-green-700 text-sm">{ok}</p>}

          <button
            disabled={loading}
            className="w-full bg-black text-white rounded-md py-2 mt-2 disabled:opacity-60"
          >
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>

          <p className="text-sm text-center text-gray-600">
            ¿Ya tienes cuenta? <Link className="underline" to="/login">Inicia sesión</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
export default Register
