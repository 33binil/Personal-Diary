import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, MoreHorizontal, Menu, RefreshCcw, Image as ImageIcon, Mic } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PageIntroFade from "../components/PageIntroFade.jsx";

const Diary2 = () => {
    const navigate = useNavigate()
    const [text, setText] = useState('')
    const [focused, setFocused] = useState(false)
    const editorRef = useRef(null)

    // Auto-resize textarea height to match content
    useEffect(() => {
        const el = editorRef.current
        if (!el) return
        const resize = () => {
            el.style.height = 'auto'
            el.style.height = el.scrollHeight + 'px'
        }
        resize()
        // Also resize on window resize to keep lines aligned
        window.addEventListener('resize', resize)
        return () => window.removeEventListener('resize', resize)
    }, [text])

    return (
        <div className="min-h-screen w-full bg-[#CC596F] text-white relative pb-28">
            <PageIntroFade outOnly hold={500} fadeOut={300} />
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
                <button onClick={() => navigate(-1)} aria-label="Back" className="p-2 rounded-lg hover:bg-white/10">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-6">
                    <MoreHorizontal className="w-6 h-6" />
                    <button className="px-6 py-2 rounded-xl bg-white/80 text-[#001331] font-semibold shadow-sm hover:bg-white">
                        Save
                    </button>
                </div>
            </div>

            {/* Date */}
            <div className="px-6 md:px-24 mt-6 md:mt-8">
                <div className="flex items-baseline gap-3">
                    <div className="font-piedra leading-none text-3xl md:text-[44px]">10</div>
                    <div className="text-base md:text-xl">April 2025</div>
                </div>
            </div>

            {/* Prompt bar */}
            <div className="px-3 md:px-24 mt-4 md:mt-6">
                <div className="bg-white/10 rounded-xl h-12 sm:h-14 md:h-16 flex items-center px-4 sm:px-6">
                    <div className="font-piedra tracking-wide text-sm sm:text-xl md:text-2xl">Diary Prompt..............</div>
                    <div className="ml-auto flex items-center left-3 relative md:left-0 gap-2 md:gap-10 text-xs sm:text-sm text-gray-200">
                        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                            <Menu className="w-4 h-4" />
                            <span>Show All</span>
                        </div>
                        <div className="flex items-center gap-2 cursor-pointer hover:text-white">
                            <RefreshCcw className="w-4 h-4" />
                            <span>New Prompt</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ruled lines editable area */}
            <div className="px-4 sm:px-8 md:px-16 mt-12 md:mt-20">
                <div
                    className="relative rounded-xl cursor-text"
                    onClick={() => editorRef.current && editorRef.current.focus()}
                >
                    {/* Placeholder that hides on focus or when there is content */}
                    <div
                        className={`pointer-events-none absolute top-2 left-4 sm:left-8 text-gray-300 transition-opacity ${
                            focused || text.length ? 'opacity-0' : 'opacity-80'
                        }`}
                    >
                        Write More Here......
                    </div>

                    <textarea
                        ref={editorRef}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        placeholder=""
                        className="w-full min-h-[420px] sm:min-h-[540px] md:min-h-[680px] bg-transparent text-white resize-none outline-none px-4 sm:px-6 md:px-8 pb-3 pt-0"
                        style={{
                            // Line height (distance between rules)
                            ['--lh']: '40px',
                            // Draw a 1px rule at the bottom of each line box
                            backgroundImage:
                                'linear-gradient(to bottom, transparent calc(var(--lh) - 1px), rgba(255,255,255,0.25) 0)',
                            backgroundSize: '100% var(--lh)',
                            backgroundRepeat: 'repeat',
                            backgroundAttachment: 'local',
                            backgroundOrigin: 'content-box',
                            // Start the first rule exactly under the first line (no top rule)
                            backgroundPosition: '0 calc(var(--lh) - 9px)',
                            lineHeight: 'var(--lh)',
                            fontSize: '18px',
                            caretColor: '#ffffff',
                        }}
                    />
                </div>
            </div>

            {/* Bottom toolbar */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 md:bottom-6">
                <div className="bg-[#942243]/60 backdrop-blur-md rounded-2xl px-6 sm:px-8 md:px-10 py-2 sm:py-3 flex items-center gap-8 md:gap-16 shadow-lg">
                    <button className="p-2 rounded-full hover:bg-white/10" aria-label="Add Image">
                        <ImageIcon className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-white/10" aria-label="Voice Input">
                        <Mic className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-r from-black via-gray-900 to-black pointer-events-none"></div>
        </div>
    )
}
export default Diary2
