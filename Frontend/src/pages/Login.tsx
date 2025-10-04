import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const Login: React.FC = () => {
  const { login, token, user } = useAuth()
  const nav = useNavigate()
  const [username, setUsername] = useState('') // <- si usas email, renómbralo
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ✅ Navega solo cuando el contexto ya tenga token + user
useEffect(() => {
  if (token) {
    nav('/items', { replace: true });
  }
}, [token, nav]);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null); setLoading(true)
    try {
      await login(username, password) // 👈 no llamamos nav aquí
      console.log('✅ Login correcto; esperando que AuthContext hidrate…')
    } catch (err: any) {
      console.error('LOGIN ERROR:', err?.response?.status, err?.response?.data)
      setError(err?.response?.data?.message || 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-sm p-6 rounded-xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Usuario</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-black text-white rounded-md py-2 mt-2 disabled:opacity-60">
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          <p className="text-sm text-center text-gray-600">
            ¿No tienes cuenta? <Link className="underline" to="/register">Regístrate</Link>
          </p>
        </div>
      </form>
    </div>
  )
}
export default Login
