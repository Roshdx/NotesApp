// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || `HTTP error! status: ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null
  }

  return response.json()
}

// ============ USER SERVICE API ============

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users`)
    return handleResponse(response)
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users/${userId}`)
    return handleResponse(response)
  },

  // Create new user
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  // Update user
  updateUser: async (userId, userData) => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users/${userId}`, {
      method: 'DELETE',
    })
    return handleResponse(response)
  },

  // Test endpoints
  testService: async () => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users/test`)
    return response.text()
  },

  testDatabase: async () => {
    const response = await fetch(`${API_BASE_URL}/userservice/api/users/test-db`)
    return response.text()
  },
}

// ============ NOTES SERVICE API ============

export const notesApi = {
  // Get all notes for a user (paginated)
  getNotes: async (userId, page = 0, size = 100) => {
    const response = await fetch(
      `${API_BASE_URL}/notes-service/api/notes?page=${page}&size=${size}`,
      {
        headers: {
          'X-User-Id': userId,
        },
      }
    )
    return handleResponse(response)
  },

  // Get note by ID
  getNoteById: async (userId, noteId) => {
    const response = await fetch(`${API_BASE_URL}/notes-service/api/notes/${noteId}`, {
      headers: {
        'X-User-Id': userId,
      },
    })
    return handleResponse(response)
  },

  // Create new note
  createNote: async (userId, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes-service/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(noteData),
    })
    return handleResponse(response)
  },

  // Update note
  updateNote: async (userId, noteId, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes-service/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify(noteData),
    })
    return handleResponse(response)
  },

  // Delete note
  deleteNote: async (userId, noteId) => {
    const response = await fetch(`${API_BASE_URL}/notes-service/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'X-User-Id': userId,
      },
    })
    return handleResponse(response)
  },
}

// ============ COMBINED API ============

export const api = {
  users: userApi,
  notes: notesApi,
}

export default api
