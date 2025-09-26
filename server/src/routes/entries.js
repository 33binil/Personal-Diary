import { Router } from 'express'
import Entry from '../models/Entry.js'
import { verifyToken } from '../middleware/firebaseAuth.js'

const router = Router()

// Create entry (authenticated)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { title, content, date, images = [], audio = [] } = req.body
    // Use verified user info
    const userId = req.user.uid
    const creatorEmail = req.user.email || ''
    const creatorName = req.user.name || ''
    const entry = await Entry.create({ title, content, date, images, audio, userId, creatorEmail, creatorName })
    res.status(201).json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// List entries (optionally filter by userId or date range)
router.get('/', async (req, res) => {
  try {
    const { userId, from, to } = req.query
    const filter = {}
    if (userId) filter.userId = userId
    if (from || to) filter.date = {}
    if (from) filter.date.$gte = new Date(from)
    if (to) filter.date.$lte = new Date(to)

    const entries = await Entry.find(filter).sort({ date: -1, createdAt: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get one
router.get('/:id', async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })
    res.json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Update
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { title, content, date, images, audio } = req.body
    const entry = await Entry.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })
    // Only allow owner to update
    if (entry.userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
    entry.title = title
    entry.content = content
    entry.date = date
    entry.images = images
    entry.audio = audio
    // preserve creatorEmail/creatorName from verified token
    entry.creatorEmail = req.user.email || entry.creatorEmail || ''
    entry.creatorName = req.user.name || entry.creatorName || ''
    await entry.save()
    res.json(entry)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Delete
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id)
    if (!entry) return res.status(404).json({ error: 'Not found' })
    if (entry.userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' })
    await entry.deleteOne()
    res.json({ ok: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

export default router
