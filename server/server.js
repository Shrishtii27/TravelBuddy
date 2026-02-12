import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import path from 'path'
import { fileURLToPath } from 'url'

// Load environment variables first
dotenv.config()

import './config/passport.js'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import tripRoutes from './routes/tripRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import itineraryRoutes from './routes/itineraryRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import postRoutes from './routes/postRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import journalRoutes from './routes/journalRoutes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8000
const ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5175'

console.log('🔧 Setting up server...')

// Middleware
app.use(cors({ origin: ORIGIN, credentials: true }))
app.use(express.json())
app.use(passport.initialize())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.get('/', (req, res) => res.send('TravelBuddy API Server is running'))

app.get('/api/test', (req, res) => {
  console.log('✅ Test route accessed')
  res.json({ success: true, message: "Test route working!", port: PORT })
})

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/journal', journalRoutes);

// Start server
async function startServer() {
  try {
    console.log('🔗 Connecting to MongoDB...')
    await connectDB()
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message)
    console.log('⚠️  Starting server without database connection...')
  }
  
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📋 Test endpoint: http://localhost:${PORT}/api/test`)
    console.log(`🔐 Auth endpoint: http://localhost:${PORT}/api/auth/register`)
  })
  
  // Handle server errors (like port conflicts)
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n❌ ERROR: Port ${PORT} is already in use!`)
      console.log('\n🔧 To fix this, run one of these commands:')
      console.log('   • lsof -ti:8000 | xargs kill -9')
      console.log('   • pkill -f "node.*server"')
      console.log('   • Or change PORT in .env file\n')
      process.exit(1)
    } else {
      console.error('❌ Server error:', err)
      process.exit(1)
    }
  })
}

startServer()
