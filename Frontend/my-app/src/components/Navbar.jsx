import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Navbar.css'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>Dashboard</h1>
        </div>
        {user && (
          <div className="navbar-user">
            <span className="user-info">
              <strong>{user.name}</strong> <span className="role-badge">{user.role.replace('_', ' ').toUpperCase()}</span>
            </span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}
