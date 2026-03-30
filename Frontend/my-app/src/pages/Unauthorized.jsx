import React from 'react'
import { Link } from 'react-router-dom'
import './Unauthorized.css'

export const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>403</h1>
        <h2>Access Denied</h2>
        <p>You don't have permission to access this resource.</p>
        <Link to="/dashboard" className="back-link">Go to Dashboard</Link>
      </div>
    </div>
  )
}
