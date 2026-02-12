import axios from 'axios'

// Determine base URL safely
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://travelbuddybak.onrender.com'
    : 'http://localhost:8000')

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 🔐 Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('travys_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 🚫 Handle auth errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.warn('Auth error detected, clearing tokens')

      localStorage.removeItem('travys_token')
      localStorage.removeItem('travys_user')
      localStorage.removeItem('travys_auth')
    }

    return Promise.reject(error)
  }
)

export default api
