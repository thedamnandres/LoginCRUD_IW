import React from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Items from './pages/Items'
import { ProtectedRoute } from './auth/ProtectedRoute'

const Home: React.FC = () => (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Inicio</h1>
      <p className="text-gray-600">Usa el menú para navegar.</p>
    </div>
  </div>
)

const App: React.FC = () => {
  const location = useLocation()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen bg-white w-full">
      {!isAuthPage && <Header />}
      <main className="w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/items" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App