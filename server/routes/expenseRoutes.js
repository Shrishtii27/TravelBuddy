import express from 'express'
import pool from '../config/postgres.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { tripId, category, startDate, endDate, limit = 50 } = req.query
    
    let queryText = 'SELECT e.*, t.name as trip_name, t.destination as trip_destination FROM expenses e LEFT JOIN trips t ON e.trip_id = t.id WHERE e.user_id = $1'
    let queryParams = [req.user.id]
    
    if (tripId) {
      queryParams.push(tripId)
      queryText += ` AND e.trip_id = $${queryParams.length}`
    }
    if (category) {
      queryParams.push(category)
      queryText += ` AND e.category = $${queryParams.length}`
    }
    if (startDate) {
      queryParams.push(new Date(startDate))
      queryText += ` AND e.date >= $${queryParams.length}`
    }
    if (endDate) {
      queryParams.push(new Date(endDate))
      queryText += ` AND e.date <= $${queryParams.length}`
    }
    
    queryText += ' ORDER BY e.date DESC LIMIT $' + (queryParams.length + 1)
    queryParams.push(parseInt(limit))

    const result = await pool.query(queryText, queryParams)
    const expenses = result.rows.map(exp => ({
      ...exp,
      amount: parseFloat(exp.amount),
      tripId: exp.trip_id ? { id: exp.trip_id, name: exp.trip_name, destination: exp.trip_destination } : null
    }))

    res.json({ expenses })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    res.status(500).json({ message: 'Failed to fetch expenses' })
  }
})

// GET /api/expenses/stats - Get expense statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const { tripId } = req.query
    
    let queryText = 'SELECT category, SUM(amount) as amount FROM expenses WHERE user_id = $1'
    let queryParams = [req.user.id]
    
    if (tripId) {
      queryParams.push(tripId)
      queryText += ` AND trip_id = $${queryParams.length}`
    }
    
    queryText += ' GROUP BY category'

    const result = await pool.query(queryText, queryParams)
    const categoryBreakdownData = result.rows.map(row => ({
      category: row.category,
      amount: parseFloat(row.amount)
    }))

    const totalAmount = categoryBreakdownData.reduce((sum, item) => sum + item.amount, 0)
    const totalExpenses = result.rowCount

    const categoryBreakdown = categoryBreakdownData.map(item => ({
      ...item,
      percentage: totalAmount > 0 ? ((item.amount / totalAmount) * 100).toFixed(1) : 0
    }))

    res.json({
      totalAmount,
      totalExpenses,
      categoryBreakdown
    })
  } catch (error) {
    console.error('Error fetching expense stats:', error)
    res.status(500).json({ message: 'Failed to fetch expense statistics' })
  }
})

// POST /api/expenses - Create new expense
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, spentBy, tripId, amount, category, description, date, paymentMethod } = req.body

    if (!title || !spentBy || !amount || !category) {
      return res.status(400).json({ message: 'Missing required fields (title, spentBy, amount, category)' })
    }

    const result = await pool.query(
      'INSERT INTO expenses (user_id, trip_id, title, spent_by, amount, category, description, date, payment_method) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [req.user.id, tripId || null, title.trim(), spentBy.trim(), parseFloat(amount), category, description?.trim() || '', date ? new Date(date) : new Date(), paymentMethod || 'card']
    );

    const expense = result.rows[0];
    res.status(201).json({ success: true, expense, message: 'Expense added successfully' })
  } catch (error) {
    console.error('Error creating expense:', error)
    res.status(500).json({ success: false, message: 'Failed to create expense' })
  }
})

// GET /api/expenses/:id - Get specific expense
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.*, t.name as trip_name, t.destination as trip_destination FROM expenses e LEFT JOIN trips t ON e.trip_id = t.id WHERE e.id = $1 AND e.user_id = $2',
      [req.params.id, req.user.id]
    );

    const expense = result.rows[0];
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ 
      expense: {
        ...expense,
        amount: parseFloat(expense.amount),
        tripId: expense.trip_id ? { id: expense.trip_id, name: expense.trip_name, destination: expense.trip_destination } : null
      }
    })
  } catch (error) {
    console.error('Error fetching expense:', error)
    res.status(500).json({ message: 'Failed to fetch expense' })
  }
})

// PUT /api/expenses/:id - Update expense
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, spentBy, amount, category, description, date, paymentMethod } = req.body

    const result = await pool.query(
      'UPDATE expenses SET title = COALESCE($1, title), spent_by = COALESCE($2, spent_by), ' +
      'amount = COALESCE($3, amount), category = COALESCE($4, category), ' +
      'description = COALESCE($5, description), date = COALESCE($6, date), ' +
      'payment_method = COALESCE($7, payment_method), updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $8 AND user_id = $9 RETURNING *',
      [title?.trim(), spentBy?.trim(), amount ? parseFloat(amount) : null, category, description?.trim(), date ? new Date(date) : null, paymentMethod, req.params.id, req.user.id]
    );

    const expense = result.rows[0];
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ success: true, expense, message: 'Expense updated successfully' })
  } catch (error) {
    console.error('Error updating expense:', error)
    res.status(500).json({ success: false, message: 'Failed to update expense' })
  }
})

// DELETE /api/expenses/:id - Delete expense
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Expense not found' })
    }

    res.json({ message: 'Expense deleted successfully' })
  } catch (error) {
    console.error('Error deleting expense:', error)
    res.status(500).json({ message: 'Failed to delete expense' })
  }
})

export default router