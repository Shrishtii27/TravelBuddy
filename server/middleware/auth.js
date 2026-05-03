import jwt from 'jsonwebtoken'
import pool from '../config/postgres.js'

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const result = await pool.query('SELECT id, email, first_name, last_name, profile_picture FROM users WHERE id = $1', [decoded.id]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }

    // Adapt database fields to expected application fields
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      profilePicture: user.profile_picture
    }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const result = await pool.query('SELECT id, email, first_name, last_name, profile_picture FROM users WHERE id = $1', [decoded.id]);
      const user = result.rows[0];
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          profilePicture: user.profile_picture
        }
      }
    } catch (err) {
      // Continue without user if token is invalid
    }
  }

  next()
}