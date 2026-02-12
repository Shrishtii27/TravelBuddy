import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import api from '../lib/api'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/api/auth/register', formData)
      const { token, user, message } = response.data

      localStorage.setItem('travys_token', token)
      localStorage.setItem('travys_user', JSON.stringify(user))

      toast.success(message || `Welcome, ${user.firstName}!`)
      navigate('/app/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/auth/google`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500 via-orange-400 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-white rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Decorative Travel Images */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15">
        <motion.img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=300&q=80"
          alt="travel decoration"
          className="absolute top-24 right-12 w-40 h-40 rounded-2xl object-cover shadow-2xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=250&q=80"
          alt="travel decoration"
          className="absolute bottom-24 left-12 w-36 h-36 rounded-2xl object-cover shadow-2xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <svg className="w-8 h-8 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-3xl font-extrabold text-white">TravelBUDDY</span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white mt-4 mb-2">Start Your Journey</h1>
          <p className="text-white/90 text-lg">Create your account and explore the world</p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-2xl font-bold text-slate-900">Sign Up</CardTitle>
              <p className="text-center text-slate-600 text-sm">Join thousands of travelers worldwide</p>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div 
                  className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm flex items-start gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="firstName" className="text-slate-700 font-semibold mb-2 block">First Name</Label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="pl-10 h-12 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-lg text-base"
                      autoFocus
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email" className="text-slate-700 font-semibold mb-2 block">Email Address</Label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 h-12 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-lg text-base"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="password" className="text-slate-700 font-semibold mb-2 block">Password</Label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create a strong password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="pl-10 h-12 border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 rounded-lg text-base"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : 'Create Account'}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-slate-500 font-medium">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400 font-semibold text-slate-700 transition-all"
                  onClick={handleGoogleSignup}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-xs text-center text-slate-600 mt-4">
                  By signing up, you agree to our{' '}
                  <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">Privacy Policy</a>
                </p>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="text-center mt-8"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-white text-base">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-200 hover:text-yellow-100 font-bold underline">
              Log in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
