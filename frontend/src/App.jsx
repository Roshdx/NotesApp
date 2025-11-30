import { useState, useEffect } from 'react'
import api from './services/api'
import Login from './components/Login'
import Register from './components/Register'
import './App.css'

function App() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [authView, setAuthView] = useState('login') // 'login' or 'register'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem('currentUserId')
    if (savedUserId) {
      loadUserById(savedUserId)
    } else {
      setLoading(false)
    }
  }, [])

  // Load notes when user changes
  useEffect(() => {
    if (currentUser) {
      loadNotes()
    } else {
      setNotes([])
      setSelectedNote(null)
    }
  }, [currentUser])

  // Load user by ID
  const loadUserById = async (userId) => {
    try {
      setLoading(true)
      const user = await api.users.getUserById(userId)
      setCurrentUser(user)
      localStorage.setItem('currentUserId', user.id)
    } catch (err) {
      console.error('Error loading user:', err)
      localStorage.removeItem('currentUserId')
    } finally {
      setLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (email) => {
    try {
      const users = await api.users.getAllUsers()
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

      if (!user) {
        throw new Error('No account found with this email address')
      }

      setCurrentUser(user)
      localStorage.setItem('currentUserId', user.id)
    } catch (err) {
      throw err
    }
  }

  // Handle registration
  const handleRegister = async (userData) => {
    try {
      // Check if email already exists
      const users = await api.users.getAllUsers()
      const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())

      if (existingUser) {
        throw new Error('An account with this email already exists')
      }

      const newUser = await api.users.createUser(userData)
      setCurrentUser(newUser)
      localStorage.setItem('currentUserId', newUser.id)
    } catch (err) {
      throw err
    }
  }

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null)
    setNotes([])
    setSelectedNote(null)
    localStorage.removeItem('currentUserId')
    setAuthView('login')
  }

  // Load notes from API
  const loadNotes = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const response = await api.notes.getNotes(currentUser.id)

      // Handle paginated response
      const notesList = response.content || response

      // Sort notes: pinned first, then by updated date
      const sortedNotes = notesList.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      })

      setNotes(sortedNotes)

      if (sortedNotes.length > 0 && !selectedNote) {
        setSelectedNote(sortedNotes[0])
      }
    } catch (err) {
      setError('Failed to load notes: ' + err.message)
      console.error('Error loading notes:', err)
    } finally {
      setLoading(false)
    }
  }

  const createNewNote = async () => {
    if (!currentUser) return

    try {
      const newNoteData = {
        title: 'Untitled Note',
        content: '',
        tags: [],
        pinned: false,
        archived: false
      }

      const newNote = await api.notes.createNote(currentUser.id, newNoteData)
      setNotes([newNote, ...notes])
      setSelectedNote(newNote)
    } catch (err) {
      setError('Failed to create note: ' + err.message)
      console.error('Error creating note:', err)
    }
  }

  const updateNote = async (id, updates) => {
    if (!currentUser) return

    try {
      const noteToUpdate = notes.find(n => n.id === id)
      const updatedNoteData = {
        title: updates.title !== undefined ? updates.title : noteToUpdate.title,
        content: updates.content !== undefined ? updates.content : noteToUpdate.content,
        tags: updates.tags !== undefined ? updates.tags : noteToUpdate.tags || [],
        pinned: updates.pinned !== undefined ? updates.pinned : noteToUpdate.pinned || false,
        archived: updates.archived !== undefined ? updates.archived : noteToUpdate.archived || false
      }

      const updatedNote = await api.notes.updateNote(currentUser.id, id, updatedNoteData)

      // Update notes list and re-sort if pinned status changed
      const updatedNotes = notes.map(note => note.id === id ? updatedNote : note)
      if (updates.pinned !== undefined) {
        updatedNotes.sort((a, b) => {
          if (a.pinned && !b.pinned) return -1
          if (!a.pinned && b.pinned) return 1
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        })
      }

      setNotes(updatedNotes)
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote)
      }
    } catch (err) {
      setError('Failed to update note: ' + err.message)
      console.error('Error updating note:', err)
    }
  }

  const deleteNote = async (id) => {
    if (!currentUser) return

    if (!confirm('Are you sure you want to delete this note?')) {
      return
    }

    try {
      await api.notes.deleteNote(currentUser.id, id)

      const filteredNotes = notes.filter(note => note.id !== id)
      setNotes(filteredNotes)

      if (selectedNote?.id === id) {
        setSelectedNote(filteredNotes[0] || null)
      }
    } catch (err) {
      setError('Failed to delete note: ' + err.message)
      console.error('Error deleting note:', err)
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }
  }

  const getPreviewText = (content) => {
    return content && content.length > 80 ? content.substring(0, 80) + '...' : content || ''
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    )
  }

  // Show auth screens if not logged in
  if (!currentUser) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setAuthView('register')}
        />
      )
    } else {
      return (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setAuthView('login')}
        />
      )
    }
  }

  // Main app (authenticated)
  return (
    <div className="app">
      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Notes</h1>
          <button className="btn-new-note" onClick={createNewNote} title="New note">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="user-section">
          <div className="user-info-display">
            <div className="user-avatar">
              {currentUser.firstName?.[0] || 'U'}
            </div>
            <div className="user-details-display">
              <span className="user-name">
                {`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim()}
              </span>
              <span className="user-email">{currentUser.email}</span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M7 13L3 9M3 9L7 5M3 9H11M11 3H13C14.1046 3 15 3.89543 15 5V13C15 14.1046 14.1046 15 13 15H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2"/>
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="notes-list">
          {filteredNotes.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? 'No notes found' : 'No notes yet. Create one!'}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'active' : ''} ${note.pinned ? 'pinned' : ''}`}
                onClick={() => setSelectedNote(note)}
              >
                <div className="note-item-header">
                  <div className="note-title-row">
                    {note.pinned && (
                      <svg className="pin-indicator" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1.5V7M5 3.5L7 1.5L9 3.5M7 7L7 12.5M5.5 11L7 12.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                    <h3 className="note-item-title">{note.title}</h3>
                  </div>
                  <span className="note-item-date">{formatDate(note.updatedAt || note.createdAt)}</span>
                </div>
                <p className="note-item-preview">{getPreviewText(note.content)}</p>
                {note.tags && note.tags.length > 0 && (
                  <div className="note-item-tags">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="note-tag">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <div className="notes-count">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </div>
        </div>
      </div>

      <div className="editor">
        {selectedNote ? (
          <>
            <div className="editor-header">
              <input
                type="text"
                className="note-title-input"
                value={selectedNote.title}
                onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                placeholder="Note title..."
              />
              <div className="editor-actions">
                <button
                  className={`btn-icon ${selectedNote.pinned ? 'active' : ''}`}
                  onClick={() => updateNote(selectedNote.id, { pinned: !selectedNote.pinned })}
                  title={selectedNote.pinned ? 'Unpin note' : 'Pin note'}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 2V9M6 5L9 2L12 5M9 9L9 16M7 14L9 16L11 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  className="btn-delete"
                  onClick={() => deleteNote(selectedNote.id)}
                  title="Delete note"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M4 5H14M7 8V12M11 8V12M5 5L6 15H12L13 5M8 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="editor-info">
              <span className="timestamp">
                Last edited: {formatDate(selectedNote.updatedAt || selectedNote.createdAt)}
              </span>
              {selectedNote.pinned && (
                <span className="pinned-badge">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1.5V7M5 3.5L7 1.5L9 3.5M7 7L7 12.5M5.5 11L7 12.5L8.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Pinned
                </span>
              )}
            </div>

            <textarea
              className="note-content-input"
              value={selectedNote.content || ''}
              onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
              placeholder="Start typing your note..."
            />
          </>
        ) : (
          <div className="empty-editor">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <rect x="15" y="20" width="50" height="45" rx="4" stroke="currentColor" strokeWidth="2"/>
              <line x1="25" y1="30" x2="55" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="25" y1="40" x2="55" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="25" y1="50" x2="45" y2="50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2>No note selected</h2>
            <p>Select a note from the sidebar or create a new one</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
