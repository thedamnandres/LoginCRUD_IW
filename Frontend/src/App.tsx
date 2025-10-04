import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Header } from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Items from './pages/Items'
import { ProtectedRoute } from './auth/ProtectedRoute'

const Home: React.FC = () => (
  <div className="max-w-6xl mx-auto p-6">
    <h1 className="text-2xl font-semibold mb-2">Inicio</h1>
    <p className="text-gray-600">Usa el menú para navegar.</p>
  </div>
)

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/items" replace />} />
      </Routes>
    </div>
  )
}

export default App