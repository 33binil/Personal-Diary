import React from 'react'

const themes = [
  { id: 1, desktop: '/thw1.png', mobile: '/thm1.png', label: 'Theme 1' },
  { id: 2, desktop: '/thw2.png', mobile: '/thm2.png', label: 'Theme 2' },
  { id: 3, desktop: '/thw3.png', mobile: '/thm3.png', label: 'Theme 3' },
]

const ThemeBoxes = ({ onSelect }) => {
  return (
    <div className="px-6 md:px-24 mt-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-4">
        {themes.map((t) => (
          <div key={t.id} className="rounded-xl overflow-hidden border border-white/10 bg-black/5 cursor-pointer" onClick={() => onSelect?.(t.id)}>
            <picture>
              <source media="(max-width: 640px)" srcSet={t.mobile} />
              <img src={t.desktop} alt={t.label} className="w-full h-32 object-cover md:h-40" />
            </picture>
            <div className="p-2 text-center text-sm text-white/90">{t.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ThemeBoxes
