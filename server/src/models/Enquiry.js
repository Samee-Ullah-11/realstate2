import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    phone: { type: String, required: [true, 'Phone is required'], trim: true, maxlength: 30 },
    message: { type: String, default: '', maxlength: 2000 },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Enquiry', enquirySchema)
