import mongoose from 'mongoose'

const ExpenseSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  spentBy: {
    type: String,
    required: true,
    trim: true
  },
  tripId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip'
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: { 
    type: String, 
    required: true,
    enum: [
      'Accommodation',
      'Food & Dining', 
      'Transportation',
      'Activities & Entertainment',
      'Shopping',
      'Miscellaneous'
    ]
  },
  description: { 
    type: String, 
    trim: true 
  },
  date: { 
    type: Date, 
    required: true,
    default: Date.now 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  paymentMethod: { 
    type: String, 
    enum: ['cash', 'card', 'upi', 'other'], 
    default: 'card' 
  }
}, { timestamps: true })

// Indexes for efficient queries
ExpenseSchema.index({ userId: 1, tripId: 1 })
ExpenseSchema.index({ date: -1 })
ExpenseSchema.index({ category: 1 })

export default mongoose.model('Expense', ExpenseSchema)