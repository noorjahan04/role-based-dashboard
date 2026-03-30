import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Admins } from './pages/Admins'
import { Users } from './pages/Users'
import { Notes } from './pages/Notes'
import { Unauthorized } from './pages/Unauthorized'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Navbar } from './components/Navbar'
import { Sidebar } from './components/Sidebar'
import { useAuth } from './hooks/useAuth'
import './App.css'

const AppLayout = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return children
  }

  return (
    <>
      <Navbar />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admins"
              element={
                <ProtectedRoute requiredRoles={['super_admin']}>
                  <Admins />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRoles={['super_admin', 'admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notes"
              element={
                <ProtectedRoute requiredRoles={['admin', 'user']}>
                  <Notes />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
