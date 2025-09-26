import React, { useEffect, useState } from 'react'

const DEFAULT_PROMPTS = [
  "What’s one thing I want to focus on today?",
  "How do I want to feel by the end of today?",
  "What am I most excited about this morning?",
  "What’s the most important task I should finish today?",
  "Who or what can I appreciate before I start my day?",
  "What’s something small that made me smile today?",
  "Did I face any challenges so far? How did I handle them?",
  "What’s one interesting thing I learned today?",
  "Did I connect with anyone in a meaningful way?",
  "How did I take care of myself today?",
  "What was the best moment of my day?",
    "What’s one thing I wish I did differently today?",
  "Did I take a step toward any of my goals?",
  "What am I grateful for right now?",
"How did I feel overall today (happy, stressed, calm, etc.)?",
"What’s a dream or goal I don’t want to forget?",
"Who inspires me right now, and why?",
"What’s a quality I love about myself?",
"What’s one fear I want to overcome?",
"If I could relive today, what would I change?",
"Describe today in just three words.",
"If today were a song, what would the lyrics be about?",
"Draw or describe the “mood” of your day with colors.",
"Imagine writing a letter to your future self about today.",
"If today were a movie scene, what would it look like?",
"What’s one mistake that taught me something valuable?",
"Who helped me today (even in a small way)?",
"What’s one win I can celebrate, no matter how small?",
"What do I want to improve on tomorrow?",
"End the day with: “I’m proud of myself for…”",
]

const hashString = (s) => {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

const PromptBar = ({ user, date, onChange }) => {
  const uid = user?.uid || 'anon'
  const day = date || new Date().toISOString().split('T')[0]
  const storageKey = `DIARY_PROMPT_${day}_${uid}`
  const prompts = DEFAULT_PROMPTS

  const defaultIndex = hashString(day) % prompts.length

  const [index, setIndex] = useState(defaultIndex)
  const [current, setCurrent] = useState(prompts[defaultIndex])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const idx = prompts.indexOf(stored)
        if (idx >= 0) {
          setIndex(idx)
          setCurrent(prompts[idx])
          onChange && onChange(prompts[idx])
          return
        } else {
          setCurrent(stored)
          onChange && onChange(stored)
          return
        }
      }
    } catch (e) {}
    // fallback to default
    setIndex(defaultIndex)
    setCurrent(prompts[defaultIndex])
    onChange && onChange(prompts[defaultIndex])
  }, [day, uid])

  const shufflePrompt = () => {
    // pick a random prompt different from current
    let i = Math.floor(Math.random() * prompts.length)
    if (prompts.length > 1) {
      let attempts = 0
      while ((i === index || prompts[i] === current) && attempts < 10) {
        i = Math.floor(Math.random() * prompts.length)
        attempts++
      }
    }
    const p = prompts[i]
    setIndex(i)
    setCurrent(p)
    try { localStorage.setItem(storageKey, p) } catch {}
    onChange && onChange(p)
  }

  return (
    <div className="px-3 md:px-24 mt-4 md:mt-6">
      <div className="bg-white/10 rounded-xl h-12 sm:h-14 md:h-16 flex items-center px-4 sm:px-6">
        <div className="font-piedra tracking-wide text-sm sm:text-xl md:text-2xl">{current}</div>
        <div className="ml-auto flex items-center gap-4 text-xs sm:text-sm text-gray-200">
          <button onClick={shufflePrompt} className="flex items-center gap-2 cursor-pointer hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v6h6M20 20v-6h-6" /></svg>
            <span>New Prompt</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default PromptBar
