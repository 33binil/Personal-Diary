import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft, MoreHorizontal, Menu, RefreshCcw, Image as ImageIcon, Mic, Save, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PageIntroFade from "../components/PageIntroFade.jsx";
import PromptBar from "../components/PromptBar";

const Diary3 = () => {
    const navigate = useNavigate()
    const { saveDiaryEntry, user, driveInitialized } = useAuth()
    const [text, setText] = useState('')
    const [title, setTitle] = useState('')
    const [focused, setFocused] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)
    const [showDonePopup, setShowDonePopup] = useState(false)
    const [showLeavePrompt, setShowLeavePrompt] = useState(false)
    const [successInfo, setSuccessInfo] = useState({ images: 0, audio: 0, hasText: false })
    const [images, setImages] = useState([])
    const [prompt, setPrompt] = useState('')
    const [audioClips, setAudioClips] = useState([])
    const [isRecording, setIsRecording] = useState(false)
    const mediaRecorderRef = useRef(null)
    const mediaStreamRef = useRef(null)
    const audioCtxRef = useRef(null)
    const analyserRef = useRef(null)
    const sourceRef = useRef(null)
    const rafRef = useRef(null)
    const canvasRef = useRef(null)
    const [showRecorderOverlay, setShowRecorderOverlay] = useState(false)
    const [viewerImage, setViewerImage] = useState(null)
    const editorRef = useRef(null)
    const imageInputRef = useRef(null)

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

    const readFilesAsDataUrls = async (fileList) => {
        const files = Array.from(fileList || [])
        const promises = files.map(file => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve({ name: file.name, dataUrl: reader.result })
            reader.onerror = reject
            reader.readAsDataURL(file)
        }))
        return Promise.all(promises)
    }

    const handlePickImages = () => {
        if (imageInputRef.current) imageInputRef.current.click()
    }

    const onImagesSelected = async (e) => {
        try {
            const selected = await readFilesAsDataUrls(e.target.files)
            setImages(prev => [...prev, ...selected])
            e.target.value = ''
        } catch (err) {
            console.error('Failed to read images', err)
            alert('Failed to read selected images')
        }
    }

    const removeImage = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx))
    }

    const removeAudioClip = (idx) => {
        setAudioClips(prev => prev.filter((_, i) => i !== idx))
    }

    const handleDiscard = () => {
        try {
            if (mediaRecorderRef.current && isRecording) mediaRecorderRef.current.stop()
            if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null }
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            if (audioCtxRef.current) { try { audioCtxRef.current.close() } catch {}; audioCtxRef.current = null }
        } catch {}
        setIsRecording(false)
        setShowRecorderOverlay(false)
        try {
            const today = new Date().toISOString().split('T')[0]
            const keyOf = (e) => `${e.date}__${(e.title||'').trim()}__${(e.content||'').trim()}`
            const currentSig = `${today}__${title.trim()}__${text.trim()}`
            const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]')
            const filtered = local.filter(e => keyOf(e) !== currentSig)
            localStorage.setItem('DIARY_LOCAL_ENTRIES', JSON.stringify(filtered))
        } catch {}
        setText('')
        setTitle('')
        setImages([])
        setAudioClips([])
        setShowLeavePrompt(false)
        navigate(-1)
    }

    const toggleRecording = async () => {
        try {
            if (isRecording) {
                setIsRecording(false)
                if (mediaRecorderRef.current) mediaRecorderRef.current.stop()
                setShowRecorderOverlay(false)
                return
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                alert('Microphone access is not available in this browser.')
                return
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            mediaStreamRef.current = stream
            let mimeType = 'audio/webm;codecs=opus'
            try {
                if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported) {
                    if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) mimeType = 'audio/webm;codecs=opus'
                    else if (MediaRecorder.isTypeSupported('audio/webm')) mimeType = 'audio/webm'
                    else if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4'
                    else if (MediaRecorder.isTypeSupported('audio/mpeg')) mimeType = 'audio/mpeg'
                    else mimeType = 'audio/webm'
                }
            } catch (e) { console.warn('MIME detection failed', e); mimeType = 'audio/webm' }
            let mediaRecorder
            try {
                if (typeof MediaRecorder === 'undefined') throw new Error('MediaRecorder not supported')
                mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
            } catch (e) {
                console.error('MediaRecorder init failed', e)
                try { if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null } } catch {}
                alert('Recording is not supported by this browser or failed to initialize.')
                return
            }
            mediaRecorderRef.current = mediaRecorder
            const chunks = []
            let startAt = Date.now()
            mediaRecorder.ondataavailable = (e) => { if (e.data && e.data.size > 0) chunks.push(e.data) }
            mediaRecorder.onstop = async () => {
                try {
                    const blob = new Blob(chunks, { type: mimeType || 'audio/webm' })
                    const durationMs = Date.now() - startAt
                    const dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader()
                        reader.onloadend = () => resolve(reader.result)
                        reader.onerror = reject
                        reader.readAsDataURL(blob)
                    })
                    const ext = mimeType && mimeType.includes('mp4') ? '.mp4' : mimeType && mimeType.includes('mpeg') ? '.mp3' : '.webm'
                    setAudioClips(prev => [...prev, { name: `recording_${new Date().toISOString()}${ext}`, dataUrl, durationMs }])
                } catch (err) {
                    console.error('Failed to process recording', err)
                    alert('Failed to process recording')
                } finally {
                    if (mediaStreamRef.current) {
                        mediaStreamRef.current.getTracks().forEach(t => t.stop())
                        mediaStreamRef.current = null
                    }
                    if (rafRef.current) cancelAnimationFrame(rafRef.current)
                    if (audioCtxRef.current) { try { audioCtxRef.current.close() } catch {}; audioCtxRef.current = null }
                    analyserRef.current = null
                    sourceRef.current = null
                    setShowRecorderOverlay(false)
                }
            }
            try {
                mediaRecorder.start()
            } catch (e) {
                console.error('MediaRecorder.start failed', e)
                try { if (mediaStreamRef.current) { mediaStreamRef.current.getTracks().forEach(t => t.stop()); mediaStreamRef.current = null } } catch {}
                alert('Failed to start recording.')
                return
            }
            setIsRecording(true)
            try {
                const AudioCtx = window.AudioContext || window.webkitAudioContext
                const audioCtx = new AudioCtx()
                const analyser = audioCtx.createAnalyser()
                analyser.fftSize = 256
                const source = audioCtx.createMediaStreamSource(stream)
                source.connect(analyser)
                audioCtxRef.current = audioCtx
                analyserRef.current = analyser
                sourceRef.current = source
                setShowRecorderOverlay(true)
                const bufferLength = analyser.frequencyBinCount
                const dataArray = new Uint8Array(bufferLength)
                const draw = () => {
                    if (!canvasRef.current || !analyserRef.current) return
                    const canvas = canvasRef.current
                    const ctx = canvas.getContext('2d')
                    const width = canvas.width
                    const height = canvas.height
                    ctx.clearRect(0, 0, width, height)
                    analyserRef.current.getByteFrequencyData(dataArray)
                    const barCount = 48
                    const step = Math.floor(bufferLength / barCount)
                    const barWidth = width / barCount
                    for (let i = 0; i < barCount; i++) {
                        const v = dataArray[i * step] / 255
                        const barHeight = Math.max(4, v * height)
                        const x = i * barWidth
                        const y = height - barHeight
                        ctx.fillStyle = 'rgba(255,255,255,0.9)'
                        ctx.fillRect(x + 2, y, barWidth - 4, barHeight)
                    }
                    rafRef.current = requestAnimationFrame(draw)
                }
                rafRef.current = requestAnimationFrame(draw)
            } catch (e) { console.warn('Visualizer init failed', e) }
        } catch (err) {
            console.error('Mic access failed', err)
            alert('Microphone not available or permission denied')
        }
    }

    const saveToLocal = () => {
        const currentDate = new Date().toISOString().split('T')[0]
        const entryTitle = title.trim() || 'My Diary Entry'
        const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]')
        local.push({
            id: `${Date.now()}_local`,
            title: entryTitle,
            content: text.trim(),
            prompt: prompt || '',
            date: currentDate,
            images,
            audio: audioClips,
            theme: 3,
            createdAt: new Date().toISOString()
        })
        localStorage.setItem('DIARY_LOCAL_ENTRIES', JSON.stringify(local))
    }

    const handleSave = async () => {
        if (!text.trim() && !title.trim() && images.length === 0 && audioClips.length === 0) {
            alert('Please write something before saving!')
            return
        }
        setIsSaving(true)
        setSaved(false)
        try {
            const currentDate = new Date().toISOString().split('T')[0]
            const entryTitle = title.trim() || 'My Diary Entry'
            let savedCloud = false
            let result = null
            if (driveInitialized) {
                result = await saveDiaryEntry(entryTitle, text.trim(), currentDate, images, audioClips, 3, prompt)
                savedCloud = !!result.success
                if (savedCloud) {
                    try {
                        const sig = `${currentDate}__${(entryTitle||'').trim()}__${(text||'').trim()}`
                        const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]')
                        const filtered = local.filter(e => `${e.date}__${(e.title||'').trim()}__${(e.content||'').trim()}` !== sig)
                        localStorage.setItem('DIARY_LOCAL_ENTRIES', JSON.stringify(filtered))
                    } catch (e) { console.warn('Failed to remove local duplicate after cloud save', e) }
                }
            }
            if (!savedCloud) {
                saveToLocal()
            }
            {
                setSaved(true)
                setSuccessInfo({ images: images.length, audio: audioClips.length, hasText: !!text.trim() })
                setShowSuccess(true)
                setImages([])
                setAudioClips([])
                setTitle('')
                setText('')
                setTimeout(() => setSaved(false), 3000)
                setTimeout(() => {
                    setShowSuccess(false)
                    navigate('/user3')
                }, 1500)
            }
        } catch (error) {
            console.error('Error saving diary:', error)
            try { saveToLocal() } catch {}
            setSaved(true)
            setSuccessInfo({ images: images.length, audio: audioClips.length, hasText: !!text.trim() })
            setShowSuccess(true)
            setImages([])
            setAudioClips([])
            setTitle('')
            setText('')
            setTimeout(() => setSaved(false), 3000)
            setTimeout(() => {
                setShowSuccess(false)
                navigate('/user3')
            }, 1500)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="min-h-screen w-full bg-[#121818] text-white relative pb-28">
            <PageIntroFade outOnly hold={500} fadeOut={300} />
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8">
                <button onClick={() => {
                    const hasDirty = (text.trim().length > 0 || title.trim().length > 0 || images.length > 0 || audioClips.length > 0) && !saved
                    if (hasDirty) setShowLeavePrompt(true); else navigate(-1)
                }} aria-label="Back" className="p-2 rounded-lg hover:bg-white/10">
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-6">
                    <MoreHorizontal className="w-6 h-6" />
                    <button onClick={() => { setShowDonePopup(true); handleSave(); setTimeout(() => navigate('/user3'), 1200); }} className="px-6 py-2 rounded-xl bg-white/80 text-[#001331] font-semibold shadow-sm hover:bg-white">
                        Save
                    </button>
                </div>
            </div>

            {/* Date and Title */}
            <div className="px-6 md:px-24 mt-6 md:mt-8">
                <div className="flex items-baseline gap-3 mb-4">
                    <div className="font-piedra leading-none text-2xl md:text-[44px]">{new Date().getDate()}</div>
                    <div className="text-sm md:text-xl">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                </div>
                <input
                    type="text"
                    placeholder="Entry title (optional)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-gray-400 text-lg md:text-xl font-semibold border-b border-white/20 focus:border-white/60 outline-none pb-2"
                />
            </div>

            {/* Prompt bar */}
            <PromptBar user={user} date={new Date().toISOString().split('T')[0]} onChange={(p) => setPrompt(p)} />

            {(images.length > 0 || audioClips.length > 0) && (
                <div className="px-4 sm:px-8 md:px-24 mt-3">
                    <div className="flex flex-wrap items-start gap-3">
                        {images.map((img, idx) => (
                            <div key={`img-${idx}`} className="relative overflow-hidden rounded-lg border border-white/20 hover:border-white/40">
                                <button onClick={() => setViewerImage(img.dataUrl)} className="block">
                                    <img src={img.dataUrl} alt="Selected" className="w-[150px] max-w-[45vw] h-auto object-contain" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeImage(idx) }}
                                    aria-label={`Remove image ${idx + 1}`}
                                    className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                                {audioClips.map((a, idx) => (
                            <div key={`aud-${idx}`} className="flex items-center gap-2 bg-white/10 rounded-lg p-2 pr-3 border border-white/20">
                                <div className="w-2 h-2 rounded-full bg-yellow-300 animate-pulse"></div>
                                <audio src={a.dataUrl} controls className="h-8 max-w-[60vw] sm:max-w-[160px]" onError={(e) => console.error('Audio playback error', e)} />
                                <button
                                    onClick={() => removeAudioClip(idx)}
                                    aria-label={`Remove audio ${idx + 1}`}
                                    className="ml-2 px-2 py-1 rounded bg-black/60 hover:bg-red-600 text-white text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Ruled lines editable area */}
            <div className="px-4 sm:px-8 md:px-16 mt-12 md:mt-20">
                <div
                    className="relative rounded-xl cursor-text"
                    onClick={() => editorRef.current && editorRef.current.focus()}
                >
                    {/* Placeholder that hides on focus or when there is content */}
                    <div
                        className={`pointer-events-none absolute top-2 left-4 sm:left-8 text-gray-300 transition-opacity ${
                            focused || text.length ? 'opacity-0' : 'opacity-75'
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

            {/* Hidden inputs */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onImagesSelected}
            />

            {/* Bottom toolbar */}
            <div className="fixed left-1/2 -translate-x-1/2 bottom-4 sm:bottom-5 md:bottom-6">
                <div className="bg-[#876E4A]/50 backdrop-blur-md rounded-2xl px-6 sm:px-8 md:px-10 py-2 sm:py-3 flex items-center gap-8 md:gap-16 shadow-lg">
                    <button onClick={handlePickImages} className="p-2 rounded-full hover:bg-white/10" aria-label="Add Image">
                        <div className="relative">
                            <ImageIcon className="w-5 h-5" />
                            {images.length > 0 && (
                                <span className="absolute -top-2 -right-3 text-[10px] bg-white text-[#001331] rounded-full px-1">{images.length}</span>
                            )}
                        </div>
                    </button>
                    <button onClick={toggleRecording} className={`p-2 rounded-full hover:bg-white/10 ${isRecording ? 'animate-pulse' : ''}`} aria-label="Voice Input">
                        <div className="relative">
                            <Mic className={`w-5 h-5 ${isRecording ? 'text-red-300' : ''}`} />
                            {audioClips.length > 0 && (
                                <span className="absolute -top-2 -right-3 text-[10px] bg-white text-[#001331] rounded-full px-1">{audioClips.length}</span>
                            )}
                        </div>
                    </button>
                </div>
            </div>

            {/* Bottom gradient removed per request */}

            {/* Success popup */}
            {showSuccess && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                    <div className="bg-white text-[#001331] rounded-2xl px-6 py-5 shadow-xl w-[90%] max-w-sm text-center">
                        <div className="font-semibold text-lg mb-2">Saved successfully</div>
                        <div className="text-sm opacity-80">
                            {successInfo.hasText ? 'Text saved' : 'No text' } · {successInfo.images} image(s) · {successInfo.audio} voice clip(s)
                        </div>
                    </div>
                </div>
            )}

            {/* Done popup for manual Save button */}
            {showDonePopup && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40">
                    <div className="bg-white text-[#001331] rounded-2xl px-6 py-5 shadow-xl w-[90%] max-w-sm text-center">
                        <div className="font-semibold text-lg">Diary completed</div>
                    </div>
                </div>
            )}

            {/* Recording overlay with visualizer */}
            {showRecorderOverlay && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60">
                    <div className="w-[90%] max-w-xl bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
                        <div className="text-white mb-4">Listening... speak now</div>
                        <div className="w-full h-24 bg-black/30 rounded-lg overflow-hidden">
                            <canvas ref={canvasRef} width={800} height={160} className="w-full h-full" />
                        </div>
                        <div className="mt-5 flex justify-center">
                            <button onClick={toggleRecording} className="px-6 py-2 rounded-lg bg-red-500 text-white">Stop</button>
                        </div>
                    </div>
                </div>
            )}

            {viewerImage && (
                <div className="fixed inset-0 z-[140] bg-black/90 flex items-center justify-center" onClick={() => setViewerImage(null)}>
                    <img src={viewerImage} alt="Full" className="max-w-[95%] max-h-[90%] object-contain" />
                </div>
            )}

            {showLeavePrompt && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60">
                    <div className="bg-[#1f2424] text-white rounded-2xl p-6 w-[90%] max-w-sm border border-white/20">
                        <div className="text-lg font-semibold mb-2">Unsaved changes</div>
                        <div className="text-sm opacity-80 mb-5">Save your diary before leaving?</div>
                        <div className="flex gap-3 justify-end">
                            <button onClick={handleDiscard} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20">Discard</button>
                            <button onClick={async () => { setShowLeavePrompt(false); await handleSave(); }} className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default Diary3
