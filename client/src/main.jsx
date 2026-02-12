import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import LandingPage from './pages/NewLandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import AuthCallback from './pages/AuthCallback.jsx'
import AppLayout from './layout/AppLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PlanTripPage from './pages/PlanTripPage.jsx'
import ItineraryViewPage from './pages/ItineraryViewPage.jsx'
import ExpenseTrackerPage from './pages/ExpenseTrackerPage.jsx'
import MyItinerariesPage from './pages/MyItinerariesPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import CommunityPage from './pages/CommunityPage.jsx'
import Journal from './pages/Journal.jsx'
import ExpenseTracker from './pages/ExpenseTracker.jsx'

// Simple Error Boundary to surface runtime errors instead of a white screen
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-semibold mb-4">Something went wrong.</h1>
          <pre className="text-left max-w-[90vw] overflow-auto bg-slate-100 p-4 rounded">
            {String(this.state.error)}
          </pre>
          <p className="mt-4 text-slate-600">Check the browser console for more details.</p>
        </div>
      )
    }
    return this.props.children
  }
}

// Protected Route Component that checks auth dynamically
const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = React.useState(false)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('travys_token')
        console.debug('[ProtectedRoute] token present?', Boolean(token))
        if (!token) {
          setIsAuth(false)
          setLoading(false)
          return
        }
        // Basic token format check
        const parts = token.split('.')
        if (parts.length < 2) {
          console.warn('[ProtectedRoute] invalid token format')
          setIsAuth(false)
          setLoading(false)
          return
        }
        const payload = JSON.parse(atob(parts[1]))
        const isValid = payload.exp * 1000 > Date.now()
        console.debug('[ProtectedRoute] token exp:', payload.exp, 'isValid:', isValid)
        setIsAuth(isValid)
        if (!isValid) {
          localStorage.removeItem('travys_token')
          localStorage.removeItem('travys_user')
          localStorage.removeItem('travys_auth')
        }
      } catch (e) {
        console.error('[ProtectedRoute] error while checking token', e)
        localStorage.removeItem('travys_token')
        localStorage.removeItem('travys_user')
        localStorage.removeItem('travys_auth')
        setIsAuth(false)
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for storage changes (when token is added)
    const handleStorageChange = () => {
      console.debug('[ProtectedRoute] storage event -> re-checking auth')
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically for token updates
    const interval = setInterval(checkAuth, 1000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  return isAuth ? children : <Navigate to="/" replace />
}

function RouteError() {
  // React Router error boundary component for better UX
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-2xl font-semibold mb-2">Unexpected Application Error</h1>
        <p className="text-slate-600">Something went wrong while loading this page. Try going back home.</p>
        <div className="mt-6">
          <a href="/" className="inline-block px-4 py-2 rounded bg-rose-600 text-white hover:bg-rose-700">Go Home</a>
        </div>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteError />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'auth/callback', element: <AuthCallback /> },
      {
        path: 'app',
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        errorElement: <RouteError />,
        children: [
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'plan-trip', element: <PlanTripPage /> },
          { path: 'itinerary', element: <ItineraryViewPage /> },
          { path: 'my-itineraries', element: <MyItinerariesPage /> },
          { path: 'expenses', element: <ExpenseTrackerPage /> },
          { path: 'expense-tracker', element: <ExpenseTracker /> },
          { path: 'journal', element: <Journal /> },
          { path: 'community', element: <CommunityPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
          },
          success: {
            style: {
              border: '1px solid #059669',
            },
          },
          error: {
            style: {
              border: '1px solid #dc2626',
            },
          },
        }}
      />
    </ErrorBoundary>
  </React.StrictMode>
)
