import mongoose from 'mongoose'

const EntrySchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    images: [{ type: String }],
    audio: [{ type: String }],
    userId: { type: String, index: true },
    creatorEmail: { type: String, index: true },
    creatorName: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model('Entry', EntrySchema)
