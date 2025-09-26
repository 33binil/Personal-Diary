import admin from 'firebase-admin'
import 'dotenv/config'
import fs from 'fs'

// Initialize Firebase Admin once
let initialized = false
export function initFirebaseAdmin() {
  if (initialized) return
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    initialized = true
    console.log('Firebase Admin initialized from service account file')
    return
  }
  // If no service account, try application default credentials
  try {
    admin.initializeApp()
    initialized = true
    console.log('Firebase Admin initialized with default credentials')
  } catch (e) {
    console.warn('Firebase Admin not initialized (no credentials provided)')
  }
}

// Middleware to verify a Firebase ID token in Authorization header
export async function verifyToken(req, res, next) {
  const auth = req.headers.authorization || ''
  const match = auth.match(/^Bearer (.+)$/)
  if (!match) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' })
  }
  const idToken = match[1]
  try {
    const decoded = await admin.auth().verifyIdToken(idToken)
    // Attach minimal user info to req.user
    req.user = { uid: decoded.uid, email: decoded.email || '', name: decoded.name || '' }
    return next()
  } catch (err) {
    console.error('Token verification failed:', err.message || err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default admin
