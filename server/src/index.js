import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { connectDB } from './config/db.js'
import entriesRouter from './routes/entries.js'
import profilesRouter from './routes/profiles.js'
import { initFirebaseAdmin } from './middleware/firebaseAuth.js'

const app = express()

// Environment
const PORT = process.env.PORT || 5000
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'

// Middleware
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(morgan('dev'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// Routes
app.use('/api/entries', entriesRouter)
app.use('/api/profiles', profilesRouter)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

// Start
connectDB().then(() => {
  // initialize Firebase Admin if possible (requires service account or ADC)
  try { initFirebaseAdmin() } catch (e) { console.warn('Firebase init error', e) }
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}).catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
