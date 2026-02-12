import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = params.get('token')
    const userParam = params.get('user')
    
    if (token) {
      localStorage.setItem('travys_token', token)
      localStorage.setItem('travys_auth', '1')
      
      // Store user data if provided
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam))
          localStorage.setItem('travys_user', JSON.stringify(userData))
        } catch (error) {
          console.log('Could not parse user data:', error)
        }
      }
      
      toast.success('🎉 Google login successful! Welcome to TravelBUDDY!')
      
      // Redirect to landing page (authenticated state)
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
    } else {
      toast.error('Google login failed. Please try again.')
      navigate('/', { replace: true })
    }
  }, [params, navigate])

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-slate-600'>Signing you in...</div>
    </div>
  )
}
