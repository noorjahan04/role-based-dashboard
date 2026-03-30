import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Sidebar.css'

export const Sidebar = () => {
  const { user } = useAuth()

  const getSidebarLinks = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Manage Admins', path: '/admins' },
          { label: 'Manage Users', path: '/users' }
        ]
      case 'admin':
        return [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Manage Users', path: '/users' },
          { label: 'My Notes', path: '/notes' }
        ]
      case 'user':
        return [
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'My Notes', path: '/notes' }
        ]
      default:
        return []
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        {getSidebarLinks().map((link) => (
          <Link key={link.path} to={link.path} className="sidebar-link">
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  )
}
