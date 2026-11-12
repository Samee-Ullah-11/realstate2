import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, default: '', maxlength: 5000 },
    purpose: { type: String, enum: ['sale', 'rent'], required: [true, 'Purpose is required'] },
    type: {
      type: String,
      enum: ['house', 'plot', 'apartment', 'commercial'],
      required: [true, 'Type is required'],
    },
    price: { type: Number, required: [true, 'Price is required'], min: 0 }, // PKR; per month when purpose is rent
    area: { type: String, required: [true, 'Area is required'], trim: true }, // e.g. Hayatabad
    address: { type: String, default: '', trim: true },
    size: { type: Number, min: 0 },
    sizeUnit: { type: String, enum: ['marla', 'kanal'], default: 'marla' },
    bedrooms: { type: Number, min: 0, default: 0 },
    bathrooms: { type: Number, min: 0, default: 0 },
    images: { type: [String], default: [] }, // image URLs
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ['available', 'sold', 'rented'], default: 'available' },
  },
  { timestamps: true }
)

export default mongoose.model('Property', propertySchema)
