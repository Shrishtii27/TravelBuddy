import express from 'express'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import { googleOAuthEnabled } from '../config/passport.js'
import { registerUser, loginUser } from '../controllers/authController.js'
import pool from '../config/postgres.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/google', (req, res, next) => {
  if (!googleOAuthEnabled) return res.status(503).json({ message: 'Google OAuth not configured on server' })
  return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next)
})

router.get('/google/callback', (req, res, next) => {
  if (!googleOAuthEnabled) return res.status(503).json({ message: 'Google OAuth not configured on server' })
  
  passport.authenticate('google', { session: false, failureRedirect: '/' }, async (err, user, info) => {
    if (err || !user) {
      console.error('❌ Google Auth Error:', err || 'No user returned');
      if (info) console.error('ℹ️ Auth Info:', info);
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5176'}/?error=auth_failed`)
    }
    
    // In PostgreSQL version, we expect 'user' to already be matched/created by passport strategy
    // We just need to sign the token with the correct ID field
    const token = jwt.sign({ id: user.id || user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    const userData = {
      id: user.id || user._id,
      email: user.email,
      firstName: user.firstName || user.first_name,
      profilePicture: user.profilePicture || user.profile_picture || null
    }
    const redirectBase = process.env.FRONTEND_URL || 'http://localhost:5176'
    const url = new URL('/auth/callback', redirectBase)
    url.searchParams.set('token', token)
    url.searchParams.set('user', encodeURIComponent(JSON.stringify(userData)))
    res.redirect(url.toString())
  })(req, res, next)
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
    const result = await pool.query('SELECT id, email, first_name, profile_picture FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    res.json({ user: { id: user.id, email: user.email, firstName: user.first_name, profilePicture: user.profile_picture || null } })
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
})

// Get user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, first_name, last_name, profile_picture, google_id, created_at, updated_at FROM users WHERE id = $1', [req.user.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePicture: user.profile_picture,
        googleId: user.google_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
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

    const result = await pool.query(
      'UPDATE users SET first_name = COALESCE($1, first_name), last_name = COALESCE($2, last_name), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [firstName, lastName, req.user.id]
    );
    
    const user = result.rows[0];
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        profilePicture: user.profile_picture,
        googleId: user.google_id,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ success: false, message: 'Failed to update profile' })
  }
})

export default router
