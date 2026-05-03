import axios from 'axios'

import { API_BASE_URL } from '../config'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 🔐 Add token automatically
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('travys_token')

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

      sessionStorage.removeItem('travys_token')
      sessionStorage.removeItem('travys_user')
      sessionStorage.removeItem('travys_auth')
    }

    return Promise.reject(error)
  }
)

export default api
