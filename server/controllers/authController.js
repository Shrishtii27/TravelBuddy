import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/UserModel.js'

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function registerUser(req, res) {
  try {
    const { email, password, firstName } = req.body
    
    if (!email || !password || !firstName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'User already exists' })

    const hash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hash, firstName })
    const token = signToken(user._id)
    res.status(201).json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName,
        profilePicture: user.profilePicture || null
      },
      message: 'User registered successfully'
    })
  } catch (err) {
    console.error('Registration error:', err)
    if (err.name === 'MongooseError') {
      res.status(503).json({ message: 'Database connection issue. Please try again later.' })
    } else {
      res.status(500).json({ message: err.message })
    }
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    
    const match = await bcrypt.compare(password, user.password || '')
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })

    const token = signToken(user._id)
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        firstName: user.firstName,
        profilePicture: user.profilePicture || null
      },
      message: 'Login successful'
    })
  } catch (err) {
    console.error('Login error:', err)
    if (err.name === 'MongooseError') {
      res.status(503).json({ message: 'Database connection issue. Please try again later.' })
    } else {
      res.status(500).json({ message: err.message })
    }
  }
}

