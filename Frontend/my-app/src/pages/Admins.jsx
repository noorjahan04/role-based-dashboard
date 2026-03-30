import React, { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosConfig'
import './ManageList.css'

export const Admins = () => {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' })

  useEffect(() => {
    fetchAdmins()
  }, [page, search])

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/admins', {
        params: { page, search, limit: 10 }
      })
      setAdmins(data.admins)
      setTotalPages(data.totalPages)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admins')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axiosInstance.put(`/admins/${editingId}`, formData)
      } else {
        await axiosInstance.post('/admins', formData)
      }
      setFormData({ name: '', email: '', phone: '', password: '' })
      setEditingId(null)
      setShowForm(false)
      fetchAdmins()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save admin')
    }
  }

  const handleEdit = (admin) => {
    setFormData({ name: admin.name, email: admin.email, phone: admin.phone, password: '' })
    setEditingId(admin._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await axiosInstance.delete(`/admins/${id}`)
        fetchAdmins()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete admin')
      }
    }
  }

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>Manage Admins</h2>
        <button onClick={() => {
          setShowForm(!showForm)
          setEditingId(null)
          setFormData({ name: '', email: '', phone: '', password: '' })
        }} className="btn-primary">
          {showForm ? 'Cancel' : 'Add New Admin'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-row">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-row">
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required={!editingId}
            />
          </div>
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Admin' : 'Create Admin'}
          </button>
        </form>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search admins by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading admins...</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.length > 0 ? (
                admins.map((admin) => (
                  <tr key={admin._id}>
                    <td>{admin.name}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phone}</td>
                    <td>{new Date(admin.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleEdit(admin)} className="btn-edit">Edit</button>
                      <button onClick={() => handleDelete(admin._id)} className="btn-delete">Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No admins found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
