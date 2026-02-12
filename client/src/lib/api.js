import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travys_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Don't automatically redirect - let the ProtectedRoute handle it
      console.warn('Auth error detected, clearing tokens but not redirecting')
      localStorage.removeItem('travys_token')
      localStorage.removeItem('travys_user')
      localStorage.removeItem('travys_auth')
      // Don't redirect automatically - let the app routing handle it
    }
    return Promise.reject(error)
  }
)

export default api
