import React, { useState, useEffect } from 'react'
import axiosInstance from '../api/axiosConfig'
import './ManageList.css'

export const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '' })

  useEffect(() => {
    fetchNotes()
  }, [page, search])

  const fetchNotes = async () => {
    setLoading(true)
    try {
      const { data } = await axiosInstance.get('/notes', {
        params: { page, search, limit: 10 }
      })
      setNotes(data.notes)
      setTotalPages(data.totalPages)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch notes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axiosInstance.put(`/notes/${editingId}`, formData)
      } else {
        await axiosInstance.post('/notes', formData)
      }
      setFormData({ title: '', content: '' })
      setEditingId(null)
      setShowForm(false)
      fetchNotes()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note')
    }
  }

  const handleEdit = (note) => {
    setFormData({ title: note.title, content: note.content })
    setEditingId(note._id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await axiosInstance.delete(`/notes/${id}`)
        fetchNotes()
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete note')
      }
    }
  }

  return (
    <div className="manage-container">
      <div className="manage-header">
        <h2>My Notes</h2>
        <button onClick={() => {
          setShowForm(!showForm)
          setEditingId(null)
          setFormData({ title: '', content: '' })
        }} className="btn-primary">
          {showForm ? 'Cancel' : 'Create Note'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="form-section">
          <input
            type="text"
            placeholder="Note Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Note Content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
            style={{ width: '100%', height: '150px', marginBottom: '10px' }}
          />
          <button type="submit" className="btn-primary">
            {editingId ? 'Update Note' : 'Create Note'}
          </button>
        </form>
      )}

      <div className="search-section">
        <input
          type="text"
          placeholder="Search notes by title or content..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <p>Loading notes...</p>
      ) : (
        <>
          <div className="notes-grid">
            {notes.length > 0 ? (
              notes.map((note) => (
                <div key={note._id} className="note-card">
                  <h3>{note.title}</h3>
                  <p>{note.content.substring(0, 100)}...</p>
                  <small>{new Date(note.createdAt).toLocaleDateString()}</small>
                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1' }}>No notes found</p>
            )}
          </div>

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
