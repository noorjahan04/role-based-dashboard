import React from 'react'
import { useAuth } from '../hooks/useAuth'
import './Dashboard.css'

export const Dashboard = () => {
  const { user } = useAuth()

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'super_admin':
        return (
          <div>
            <h2>Super Admin Dashboard</h2>
            <p>Welcome, Super Admin! You have full control over the system.</p>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Manage Admins</h3>
                <p>Create, edit, and delete admin accounts</p>
              </div>
              <div className="stat-card">
                <h3>Manage Users</h3>
                <p>View and manage all user accounts</p>
              </div>
              <div className="stat-card">
                <h3>System Control</h3>
                <p>Full access to all system features</p>
              </div>
            </div>
          </div>
        )
      case 'admin':
        return (
          <div>
            <h2>Admin Dashboard</h2>
            <p>Welcome, Admin! You can manage users and create notes.</p>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Manage Users</h3>
                <p>Create, edit, and delete user accounts</p>
              </div>
              <div className="stat-card">
                <h3>My Notes</h3>
                <p>Create and organize your personal notes</p>
              </div>
            </div>
          </div>
        )
      case 'user':
        return (
          <div>
            <h2>User Dashboard</h2>
            <p>Welcome! You can create and manage your notes.</p>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>My Notes</h3>
                <p>Create, edit, and delete your notes</p>
              </div>
            </div>
          </div>
        )
      default:
        return <p>Loading...</p>
    }
  }

  return (
    <div className="dashboard">
      {getDashboardContent()}
    </div>
  )
}
