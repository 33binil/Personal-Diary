import { Router } from 'express'
import Profile from '../models/Profile.js'
import { verifyToken } from '../middleware/firebaseAuth.js'

const router = Router()

// Get profile by userId
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    let profile = await Profile.findOne({ userId })
    if (!profile) {
      // return empty profile if not found
      return res.json({ userId, name: '', email: '', quote: '' })
    }
    res.json({ userId: profile.userId, name: profile.name || '', email: profile.email || '', quote: profile.quote })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Create or update quote for user
// Update quote for the authenticated user (only owner may update their own quote)
router.put('/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params
    // Only allow updating your own profile
    if (userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
    const { quote = '', name = '', email = '' } = req.body
    const opts = { upsert: true, new: true, setDefaultsOnInsert: true }
    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: { quote, name, email } },
      opts
    )
    res.json({ userId: profile.userId, name: profile.name || '', email: profile.email || '', quote: profile.quote })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
