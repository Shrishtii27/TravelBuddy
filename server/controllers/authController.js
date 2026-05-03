import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/postgres.js'

/**
 * Signs a JWT token for the user
 * @param {string|number} id User ID
 * @returns {string} Signed JWT
 */
function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function registerUser(req, res) {
  try {
    const { email, password, firstName } = req.body
    
    if (!email || !password || !firstName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    
    // Insert new user
    const newUserResult = await pool.query(
      'INSERT INTO users (email, password, first_name) VALUES ($1, $2, $3) RETURNING id, email, first_name, profile_picture',
      [email, hash, firstName]
    );

    const user = newUserResult.rows[0];
    const token = signToken(user.id)

    return res.status(201).json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name,
        profilePicture: user.profile_picture || null
      },
      message: 'User registered successfully'
    })
  } catch (err) {
    console.error('Registration error:', err)
    return res.status(500).json({ message: 'Internal server error during registration' })
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const match = await bcrypt.compare(password, user.password || '')
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user.id)
    return res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name,
        profilePicture: user.profile_picture || null
      },
      message: 'Login successful'
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ message: 'Internal server error during login' })
  }
}

