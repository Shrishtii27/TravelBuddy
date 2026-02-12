import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userPhoto: String,
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  author: {
    name: { type: String, required: true },
    email: String,
    profilePicture: String
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200
  },
  content: {
    type: String,
    required: true,
    maxLength: 5000
  },
  destination: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    caption: String
  }],
  itineraryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itinerary'
  },
  tripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  viewCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true 
});

// Indexes for efficient querying
postSchema.index({ createdAt: -1 });
postSchema.index({ destination: 1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'author.name': 'text', title: 'text', content: 'text', destination: 'text' });

const Post = mongoose.model('Post', postSchema);

export default Post;
