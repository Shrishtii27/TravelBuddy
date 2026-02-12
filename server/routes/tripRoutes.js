import express from 'express'
import Trip from '../models/TripModel.js'
import Expense from '../models/ExpenseModel.js'
import Notification from '../models/NotificationModel.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Use centralized auth middleware that sets req.user
const authenticateUser = (req, res, next) => {
  authenticateToken(req, res, (err) => {
    if (err) return next(err)
    req.userId = req.user._id
    next()
  })
}

// GET /api/trips - Get all trips for logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.userId })
      .sort({ startDate: -1 })
      .lean()

    // Add expense stats to each trip
    const tripsWithStats = await Promise.all(trips.map(async (trip) => {
      const expenses = await Expense.find({ tripId: trip._id })
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)
      const expenseCount = expenses.length
      
      return {
        ...trip,
        totalSpent,
        remaining: trip.budget - totalSpent,
        expenseCount
      }
    }))

    res.json({ trips: tripsWithStats })
  } catch (error) {
    console.error('Error fetching trips:', error)
    res.status(500).json({ message: 'Failed to fetch trips' })
  }
})

// POST /api/trips - Create new trip
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description } = req.body

    // Validation
    if (!name || !destination || !startDate || !endDate || !budget) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    if (new Date(endDate) <= new Date(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date' })
    }

    if (budget <= 0) {
      return res.status(400).json({ message: 'Budget must be greater than 0' })
    }

    const trip = new Trip({
      userId: req.userId,
      name: name.trim(),
      destination: destination.trim(),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      budget: parseFloat(budget),
      description: description?.trim() || ''
    })

    await trip.save()
    
    // Create notification for new trip
    await Notification.create({
      userId: req.userId,
      title: 'Trip created!',
      message: `Your trip to ${destination} has been created successfully`,
      type: 'trip',
      relatedId: trip._id
    }).catch(err => console.error('Error creating notification:', err))
    
    res.status(201).json({ trip, message: 'Trip created successfully' })
  } catch (error) {
    console.error('Error creating trip:', error)
    res.status(500).json({ message: 'Failed to create trip' })
  }
})

// GET /api/trips/:id - Get specific trip
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).lean()

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    // Get expenses for this trip
    const expenses = await Expense.find({ tripId: trip._id }).sort({ date: -1 })
    const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    res.json({
      trip: {
        ...trip,
        totalSpent,
        remaining: trip.budget - totalSpent,
        expenses
      }
    })
  } catch (error) {
    console.error('Error fetching trip:', error)
    res.status(500).json({ message: 'Failed to fetch trip' })
  }
})

// PUT /api/trips/:id - Update trip
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description, status } = req.body

    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    // Update fields if provided
    if (name) trip.name = name.trim()
    if (destination) trip.destination = destination.trim()
    if (startDate) trip.startDate = new Date(startDate)
    if (endDate) trip.endDate = new Date(endDate)
    if (budget) trip.budget = parseFloat(budget)
    if (description !== undefined) trip.description = description.trim()
    if (status) trip.status = status

    // Validate dates if both are provided
    if (trip.endDate <= trip.startDate) {
      return res.status(400).json({ message: 'End date must be after start date' })
    }

    await trip.save()
    res.json({ trip, message: 'Trip updated successfully' })
  } catch (error) {
    console.error('Error updating trip:', error)
    res.status(500).json({ message: 'Failed to update trip' })
  }
})

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const trip = await Trip.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    })

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    // Delete all expenses for this trip
    await Expense.deleteMany({ tripId: trip._id })
    
    // Delete the trip
    await Trip.deleteOne({ _id: trip._id })

    res.json({ message: 'Trip and all associated expenses deleted successfully' })
  } catch (error) {
    console.error('Error deleting trip:', error)
    res.status(500).json({ message: 'Failed to delete trip' })
  }
})

export default router