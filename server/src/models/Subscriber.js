import mongoose from 'mongoose'

// People who asked for updates in the "Stay in the loop" section.
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
  },
  { timestamps: true }
)

export default mongoose.model('Subscriber', subscriberSchema)
