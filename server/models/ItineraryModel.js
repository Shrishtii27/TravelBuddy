import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  totalDays: {
    type: Number,
    required: true
  },
  travelers: {
    type: Number,
    default: 2
  },
  itineraryData: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Itinerary', ItinerarySchema);
