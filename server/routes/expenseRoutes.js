import express from 'express'
import Expense from '../models/ExpenseModel.js'
import Trip from '../models/TripModel.js'
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

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', authenticateUser, async (req, res) => {
  try {
    const { tripId, category, startDate, endDate, limit = 50 } = req.query
    
    let query = { userId: req.userId }
    
    // Add filters if provided
    if (tripId) query.tripId = tripId
    if (category) query.category = category
    if (startDate || endDate) {
      query.date = {}
      if (startDate) query.date.$gte = new Date(startDate)
      if (endDate) query.date.$lte = new Date(endDate)
    }

    const expenses = await Expense.find(query)
      .populate('tripId', 'name destination')
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .lean()

    res.json({ expenses })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    res.status(500).json({ message: 'Failed to fetch expenses' })
  }
})

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', authenticateUser, async (req, res) => {
  try {
    const { tripId } = req.query
    
    let matchQuery = { userId: req.userId }
    if (tripId) matchQuery.tripId = tripId

    const stats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalExpenses: { $sum: 1 },
          categoryBreakdown: {
            $push: { category: '$category', amount: '$amount' }
          }
        }
      }
    ])

    if (!stats.length) {
      return res.json({
        totalAmount: 0,
        totalExpenses: 0,
        categoryBreakdown: []
      })
    }

    // Process category breakdown
    const categoryMap = {}
    stats[0].categoryBreakdown.forEach(item => {
      if (categoryMap[item.category]) {
        categoryMap[item.category] += item.amount
      } else {
        categoryMap[item.category] = item.amount
      }
    })

    const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / stats[0].totalAmount) * 100).toFixed(1)
    }))

    res.json({
      totalAmount: stats[0].totalAmount,
      totalExpenses: stats[0].totalExpenses,
      categoryBreakdown
    })
  } catch (error) {
    console.error('Error fetching expense stats:', error)
    res.status(500).json({ message: 'Failed to fetch expense statistics' })
  }
})

// POST /api/expenses - Create new expense
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { title, spentBy, tripId, amount, category, description, date, paymentMethod } = req.body

    // Validation
    if (!title || !spentBy || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields (title, spentBy, amount, category)' })
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' })
    }

    // If tripId provided, verify trip belongs to user
    if (tripId) {
      const trip = await Trip.findOne({ _id: tripId, userId: req.userId })
      if (!trip) {
        return res.status(404).json({ message: 'Trip not found' })
      }
    }

    const expense = new Expense({
      userId: req.userId,
      title: title.trim(),
      spentBy: spentBy.trim(),
      tripId: tripId || undefined,
      amount: parseFloat(amount),
      category,
      description: description ? description.trim() : '',
      date: date ? new Date(date) : new Date(),
      paymentMethod: paymentMethod || 'card'
    })

    await expense.save()
    
    // Populate trip info for response if tripId exists
    if (tripId) {
      await expense.populate('tripId', 'name destination')
    }
    
    res.status(201).json({ success: true, expense, message: 'Expense added successfully' })
  } catch (error) {
    console.error('Error creating expense:', error)
    res.status(500).json({ success: false, message: 'Failed to create expense' })
  }
})

// GET /api/expenses/:id - Get specific expense
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    }).populate('tripId', 'name destination').lean()

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ expense })
  } catch (error) {
    console.error('Error fetching expense:', error)
    res.status(500).json({ message: 'Failed to fetch expense' })
  }
})

// PUT /api/expenses/:id - Update expense
router.put('/:id', authenticateUser, async (req, res) => {
  try {
    const { title, spentBy, amount, category, description, date, paymentMethod } = req.body

    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    // Update fields if provided
    if (title) expense.title = title.trim()
    if (spentBy) expense.spentBy = spentBy.trim()
    if (amount) expense.amount = parseFloat(amount)
    if (category) expense.category = category
    if (description !== undefined) expense.description = description.trim()
    if (date) expense.date = new Date(date)
    if (paymentMethod) expense.paymentMethod = paymentMethod

    await expense.save()
    
    if (expense.tripId) {
      await expense.populate('tripId', 'name destination')
    }
    
    res.json({ success: true, expense, message: 'Expense updated successfully' })
  } catch (error) {
    console.error('Error updating expense:', error)
    res.status(500).json({ success: false, message: 'Failed to update expense' })
  }
})

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    })

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    await Expense.deleteOne({ _id: expense._id })
    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    res.status(500).json({ message: 'Failed to delete expense' })
  }
})

export default router