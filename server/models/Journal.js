import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  tripDate: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    required: true,
    maxLength: 10000
  },
  images: [{
    type: String,
    required: true
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  // Optional AI enhancements
  formattedNotes: {
    type: String
  },
  mood: {
    type: String
  },
  highlights: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
journalSchema.index({ userId: 1, createdAt: -1 });
journalSchema.index({ isPublic: 1, createdAt: -1 });
journalSchema.index({ destination: 1 });

const Journal = mongoose.model('Journal', journalSchema);

export default Journal;
