import React, { useEffect, useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'

const QuoteEditor = ({ user }) => {
  const uid = user?.uid
  const storageKey = uid ? `quote_${uid}` : 'quote_anonymous'

  const [quote, setQuote] = useState('')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // Try backend if we have a uid
      if (uid) {
        try {
          const res = await fetch(`/api/profiles/${uid}`)
          if (res.ok) {
            const data = await res.json()
            setQuote(data.quote || '')
            setDraft(data.quote || '')
            try { localStorage.setItem(storageKey, data.quote || '') } catch {}
            setLoading(false)
            return
          }
        } catch (e) {
          // ignore and fallback to localStorage
        }
      }

      // Fallback to localStorage
      try {
        const local = localStorage.getItem(storageKey) || ''
        setQuote(local)
        setDraft(local)
      } catch {}
      setLoading(false)
    }

    load()
  }, [uid])

  const handleSave = async () => {
    const newQuote = draft
    setSaving(true)
    // Try backend when uid exists
    if (uid) {
      try {
        const res = await fetch(`/api/profiles/${uid}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quote: newQuote })
        })
        if (res.ok) {
          const data = await res.json()
          setQuote(data.quote || '')
          try { localStorage.setItem(storageKey, data.quote || '') } catch {}
          setEditing(false)
          setSaving(false)
          return
        }
      } catch (e) {
        // fall back to localStorage
      }
    }

    // fallback save
    try { localStorage.setItem(storageKey, newQuote) } catch {}
    setQuote(newQuote)
    setEditing(false)
    setSaving(false)
  }

  const handleCancel = () => {
    setDraft(quote)
    setEditing(false)
  }

  if (loading) return <div className="text-white/80">Loading...</div>

  return (
    <div className="w-full flex items-start justify-center p-6 pointer-events-auto">
      <div className="max-w-[1200px] w-full flex items-center justify-between gap-4">
        <div className="flex-1">
          {editing ? (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full h-24 md:h-28 lg:h-36 p-3 rounded bg-black/40 text-white resize-none focus:outline-none"
              placeholder={`Write your quote...`}
            />
          ) : (
            <div className="text-white font-piedra text-lg md:text-xl lg:text-4xl">
              {quote ? `"${quote}"` : '"Your quote goes here"'}
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          {editing ? (
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={saving} className="text-green-400 hover:text-green-300">
                {saving ? <div className="w-5 h-5 animate-spin border-2 border-green-400 border-t-transparent rounded-full"></div> : <Check className="w-5 h-5" />}
              </button>
              <button onClick={handleCancel} disabled={saving} className="text-red-400 hover:text-red-300">
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button onClick={() => setEditing(true)} className="text-white/80 hover:text-white">
              <Edit2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuoteEditor
