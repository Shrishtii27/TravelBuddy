import mongoose from 'mongoose'

const SavedPreferencesSchema = new mongoose.Schema({
  budgetRange: { type: String },
  travelStyle: { type: String, enum: ['adventure', 'leisure', 'cultural', 'food-focused'] },
}, { _id: false })

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  profilePicture: { type: String },
  savedPreferences: { type: SavedPreferencesSchema, default: {} },
}, { timestamps: true })

export default mongoose.model('User', UserSchema)
