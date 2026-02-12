import mongoose from 'mongoose'

const TripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  destination: { 
    type: String, 
    required: true,
    trim: true 
  },
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  budget: { 
    type: Number, 
    required: true,
    min: 0 
  },
  currency: { 
    type: String, 
    default: 'INR' 
  },
  status: { 
    type: String, 
    enum: ['planned', 'ongoing', 'completed'], 
    default: 'planned' 
  },
  description: { 
    type: String,
    trim: true 
  }
}, { timestamps: true })

// Index for efficient queries
TripSchema.index({ userId: 1, startDate: -1 })

export default mongoose.model('Trip', TripSchema)