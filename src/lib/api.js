// Simple API client for frontend
// Configure base URL via VITE_API_URL or fallback to localhost:5000
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getAuthHeaders() {
  try {
    const token = localStorage.getItem('FIREBASE_ID_TOKEN')
    if (token) return { Authorization: `Bearer ${token}` }
  } catch (e) {}
  return {}
}

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}), ...getAuthHeaders() },
    ...options,
  })
  if (!res.ok) {
    const msg = await res.text()
    throw new Error(msg || res.statusText)
  }
  const text = await res.text()
  try { return JSON.parse(text) } catch { return text }
}

export function createEntry(data) {
  return api('/api/entries', { method: 'POST', body: JSON.stringify(data) })
}

export function listEntries(params = {}) {
  const qs = new URLSearchParams(params).toString()
  return api(`/api/entries${qs ? `?${qs}` : ''}`)
}
