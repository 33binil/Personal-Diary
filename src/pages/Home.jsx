import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Features from './Features'
import Bottom from './Bottom'

const Home = () => {
    const navigate = useNavigate()
    const [animationStage, setAnimationStage] = useState('black-screen') // black-screen, logo-fade-in, logo-show, logo-move, content-show

    useEffect(() => {
        const timeline = [
            { stage: 'logo-fade-in', delay: 500 },      // Start logo fade in after 0.5s
            { stage: 'logo-show', delay: 750 },        // Logo fully visible for 1s
            { stage: 'logo-move', delay: 2500 },        // Start moving to top-center (2s delay)
            { stage: 'content-show', delay: 3500 }      // Show main content
        ]

        const timers = timeline.map(({ stage, delay }) => 
            setTimeout(() => setAnimationStage(stage), delay)
        )

        return () => timers.forEach(timer => clearTimeout(timer))
    }, [])

    const handleSignInClick = () => {
        navigate('/login')
    }

    return (
        <div>
        <div className="relative w-screen h-screen overflow-hidden">
            {/* Background Image - visible when logo moves */}
            <img 
                src="/home.jpg" 
                alt="Home Background" 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    animationStage === 'logo-move' || animationStage === 'content-show' ? 'opacity-100' : 'opacity-0'
                }`}
            />
            
            {/* Black Overlay - fades out when logo moves */}
            <div className={`absolute inset-0 bg-black transition-opacity duration-1000 ${
                animationStage === 'logo-move' || animationStage === 'content-show' ? 'bg-opacity-70' : 'bg-opacity-100'
            }`}></div>
            
            {/* Logo Animation */}
            <div className={`absolute z-20 transition-all duration-1000 ease-in-out ${
                animationStage === 'black-screen' ? 'opacity-0 scale-75' :
                animationStage === 'logo-fade-in' ? 'opacity-100 scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                animationStage === 'logo-show' ? 'opacity-100 scale-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
                animationStage === 'logo-move' ? 'opacity-100 scale-75 top-4 left-1/2 transform -translate-x-1/2 translate-y-0' :
                'opacity-100 scale-75 top-4 left-1/2 transform -translate-x-1/2 translate-y-0'
            }`}>
                <img 
                    src="/logo.jpg"
                    alt="Diary Logo" 
                    className={`transition-all duration-1000 ${
                        animationStage === 'logo-move' || animationStage === 'content-show' 
                            ? 'w-[120px] h-auto' : 'w-[600px] h-auto'
                    }`}
                />
            </div>
            
            {/* Content Container - only visible at the end */}
            <div className={`relative z-10 flex flex-col items-center justify-center h-full px-4 transition-opacity duration-1000 ${
                animationStage === 'content-show' ? 'opacity-100' : 'opacity-0'
            }`}>
                {/* Personal Diary Title */}
                <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-pinyon text-center mb-12 tracking-wide drop-shadow-[3px_6px_1px_rgba(0,0,0,0.25)]">
                    Personal Diary
                </h1>
                
                {/* Sign in / Sign up Button */}
                <button 
                    onClick={handleSignInClick}
                    className="bg-black hover:bg-gray-800 text-white text-[10px] md:text-[14px] lg:text-[16px] font-piedra tracking-wider py-4 px-8 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-600"
                >
                    Sign in / Sign up
                </button>
            </div>
        </div>
        
        {/* Features Section - Only visible after content shows */}
        <div className={`transition-opacity duration-1000 ${
            animationStage === 'content-show' ? 'opacity-100' : 'opacity-0'
        }`}>
            <Features />
        </div>
        
        {/* Bottom Section - Only visible after content shows */}
        <div className={`transition-opacity duration-1000 ${
            animationStage === 'content-show' ? 'opacity-100' : 'opacity-0'
        }`}>
            <Bottom />
        </div>
    </div>
    )
}

export default Home
