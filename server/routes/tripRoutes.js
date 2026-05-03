import express from 'express'
import pool from '../config/postgres.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// GET /api/trips - Get all trips for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT t.*, ' +
      '(SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) as total_spent, ' +
      '(SELECT COUNT(*) FROM expenses WHERE trip_id = t.id) as expense_count ' +
      'FROM trips t WHERE t.user_id = $1 ORDER BY t.start_date DESC',
      [req.user.id]
    );

    const trips = result.rows.map(trip => ({
      ...trip,
      totalSpent: parseFloat(trip.total_spent),
      remaining: parseFloat(trip.budget) - parseFloat(trip.total_spent),
      expenseCount: parseInt(trip.expense_count),
      startDate: trip.start_date,
      endDate: trip.end_date
    }));

    res.json({ trips })
  } catch (error) {
    console.error('Error fetching trips:', error)
    res.status(500).json({ message: 'Failed to fetch trips' })
  }
})

// POST /api/trips - Create new trip
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description } = req.body

    if (!name || !destination || !startDate || !endDate || !budget) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const result = await pool.query(
      'INSERT INTO trips (user_id, name, destination, start_date, end_date, budget, description) ' +
      'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, name.trim(), destination.trim(), new Date(startDate), new Date(endDate), parseFloat(budget), description?.trim() || '']
    );

    const trip = result.rows[0];
    
    // Create notification
    await pool.query(
      'INSERT INTO notifications (user_id, title, message, type, related_id) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, 'Trip created!', `Your trip to ${destination} has been created successfully`, 'trip', trip.id]
    ).catch(err => console.error('Error creating notification:', err));
    
    res.status(201).json({ trip, message: 'Trip created successfully' })
  } catch (error) {
    console.error('Error creating trip:', error)
    res.status(500).json({ message: 'Failed to create trip' })
  }
})

// GET /api/trips/:id - Get specific trip
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const tripResult = await pool.query(
      'SELECT * FROM trips WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.id]
    );

    const trip = tripResult.rows[0];
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    const expensesResult = await pool.query(
      'SELECT * FROM expenses WHERE trip_id = $1 ORDER BY date DESC',
      [trip.id]
    );

    const expenses = expensesResult.rows;
    const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    res.json({
      trip: {
        ...trip,
        totalSpent,
        remaining: parseFloat(trip.budget) - totalSpent,
        expenses
      }
    })
  } catch (error) {
    console.error('Error fetching trip:', error)
    res.status(500).json({ message: 'Failed to fetch trip' })
  }
})

// PUT /api/trips/:id - Update trip
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { name, destination, startDate, endDate, budget, description, status } = req.body

    const result = await pool.query(
      'UPDATE trips SET name = COALESCE($1, name), destination = COALESCE($2, destination), ' +
      'start_date = COALESCE($3, start_date), end_date = COALESCE($4, end_date), ' +
      'budget = COALESCE($5, budget), description = COALESCE($6, description), ' +
      'status = COALESCE($7, status), updated_at = CURRENT_TIMESTAMP ' +
      'WHERE id = $8 AND user_id = $9 RETURNING *',
      [name?.trim(), destination?.trim(), startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null, budget ? parseFloat(budget) : null, description?.trim(), status, req.params.id, req.user.id]
    );

    const trip = result.rows[0];
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    res.json({ trip, message: 'Trip updated successfully' })
  } catch (error) {
    console.error('Error updating trip:', error)
    res.status(500).json({ message: 'Failed to update trip' })
  }
})

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trip not found' })
    }

    res.json({ message: 'Trip and all associated expenses deleted successfully' })
  } catch (error) {
    console.error('Error deleting trip:', error)
    res.status(500).json({ message: 'Failed to delete trip' })
  }
})

export default router