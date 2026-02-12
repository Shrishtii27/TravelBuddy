import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { googleOAuthEnabled } from '../config/passport.js'
import { registerUser, loginUser } from '../controllers/authController.js'
import User from '../models/UserModel.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/google', (req, res, next) => {
  if (!googleOAuthEnabled) return res.status(503).json({ message: 'Google OAuth not configured on server' })
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
  if (!googleOAuthEnabled) return res.status(503).json({ message: 'Google OAuth not configured on server' })
  console.log('🔄 Google callback initiated...')
  
  passport.authenticate('google', { session: false, failureRedirect: '/' })(req, res, (err) => {
    console.log('🔍 Inside callback function:')
    console.log('  - Error:', err)
    console.log('  - req.user exists:', !!req.user)
    console.log('  - req.user:', req.user)
    
    if (err) {
      console.error('❌ Authentication error:', err)
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=auth_failed`)
    }
    
    if (!req.user) {
      console.error('❌ req.user is undefined after authentication')
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/?error=no_user`)
    }
    
    console.log('✅ User authenticated successfully:', req.user.email)
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const userData = {
      id: req.user._id,
      email: req.user.email,
      firstName: req.user.firstName,
      profilePicture: req.user.profilePicture || null
    }
    const redirectBase = process.env.FRONTEND_URL || 'http://localhost:5173'
    const url = new URL('/auth/callback', redirectBase)
    url.searchParams.set('token', token)
    url.searchParams.set('user', encodeURIComponent(JSON.stringify(userData)))
    console.log('🔄 Redirecting to:', url.toString())
    res.redirect(url.toString())
  })
})

// Email/password authentication routes
router.post('/register', registerUser)
router.post('/login', loginUser)

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'Access token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('-password')
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    res.json({ user: { id: user._id, email: user.email, firstName: user.firstName, profilePicture: user.profilePicture || null } })
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
})

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ 
      success: true, 
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch profile' })
  }
})

// Update user profile (protected route)
router.patch('/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body

    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Update allowed fields
    if (firstName !== undefined) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName

    await user.save()

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        googleId: user.googleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ success: false, message: 'Failed to update profile' })
  }
})

export default router
