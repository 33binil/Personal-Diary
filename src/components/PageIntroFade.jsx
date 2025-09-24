import React, { useEffect, useState } from 'react'

// Fullscreen intro overlay: can fade in + out, or only fade out after a delay
// Props:
// - fadeIn: ms for fade-in duration (ignored when outOnly=true)
// - hold: ms to stay fully opaque before fading out
// - fadeOut: ms for fade-out duration
// - color: overlay color (default black)
// - outOnly: if true, start fully opaque and only fade out after hold
const PageIntroFade = ({ fadeIn = 100, hold = 100, fadeOut = 100, color = '#000', outOnly = false }) => {
  const [mounted, setMounted] = useState(true)
  const [opacity, setOpacity] = useState(outOnly ? 1 : 0)
  const [duration, setDuration] = useState(outOnly ? fadeOut : fadeIn)

  useEffect(() => {
    let raf
    let toFadeOut
    let toUnmount

    if (outOnly) {
      // Wait for hold, then fade out
      toFadeOut = setTimeout(() => {
        setDuration(fadeOut)
        setOpacity(0)
      }, hold)

      toUnmount = setTimeout(() => setMounted(false), hold + fadeOut)
    } else {
      // Fade in, hold, fade out
      raf = requestAnimationFrame(() => setOpacity(1))
      toFadeOut = setTimeout(() => {
        setDuration(fadeOut)
        setOpacity(0)
      }, fadeIn + hold)
      toUnmount = setTimeout(() => setMounted(false), fadeIn + hold + fadeOut)
    }

    return () => {
      if (raf) cancelAnimationFrame(raf)
      if (toFadeOut) clearTimeout(toFadeOut)
      if (toUnmount) clearTimeout(toUnmount)
    }
  }, [outOnly, fadeIn, hold, fadeOut])

  if (!mounted) return null

  const style = {
    backgroundColor: color,
    opacity,
    transition: `opacity ${duration}ms ease-in-out`,
  }

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none" style={style} />
  )
}

export default PageIntroFade
