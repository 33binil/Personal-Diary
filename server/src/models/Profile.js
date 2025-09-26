import mongoose from 'mongoose'

const ProfileSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    // Store display name and email for quick access in the profile collection
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    quote: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.model('Profile', ProfileSchema)
