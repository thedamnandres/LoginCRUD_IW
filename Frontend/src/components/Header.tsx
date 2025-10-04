import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const NavLink: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      className={`px-3 py-2 rounded-md ${active ? 'bg-black text-white' : 'hover:bg-gray-100 text-black'}`}
      to={to}
    >
      {label}
    </Link>
  )
}

export const Header: React.FC = () => {
  const { user, token, logout } = useAuth()
  const isAuth = Boolean(token || user)

  return (
    <header className="border-b bg-white text-black">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="font-bold">LoginCRUD</span>
          {isAuth && (
            <nav className="ml-4 flex gap-2">
              <NavLink to="/items" label="Items" />
            </nav>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              {user && (
                <span className="text-sm text-gray-700">
                  {user.email} ({user.role})
                </span>
              )}
              <button
                onClick={logout}
                className="px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <nav className="flex gap-2">
              <NavLink to="/login" label="Login" />
              <NavLink to="/register" label="Register" />
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
