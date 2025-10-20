import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Features = () => {
    const navigate = useNavigate()
    const [visibleElements, setVisibleElements] = useState(new Set())

    useEffect(() => {
        // Create intersection observer for scroll-triggered animations
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleElements(prev => new Set([...prev, entry.target.id]))
                    }
                })
            },
            {
                threshold: 0.1, // Trigger when 10% of element is visible
                rootMargin: '50px 0px -50px 0px' // Start animation slightly before entering viewport
            }
        )

        // Observe all animated elements
        const elementsToObserve = document.querySelectorAll('[data-animate]')
        elementsToObserve.forEach((el) => {
            observer.observe(el)
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    const handleSignInClick = () => {
        navigate('/login')
    }
    return (
        <div className="relative min-h-screen bg-gray-100 py-20 sm:py-12 lg:py-20 overflow-hidden">
            {/* Left Side Flower - Hidden on mobile, visible on larger screens */}
            <img 
                src="/flower.png" 
                alt="Decorative Flower" 
                className="lg:block absolute bottom-36 -left-12 md:-left-32 lg:-left-48 w-[250px] md:w-[600px] lg:w-[890px] h-auto opacity-70 z-0 rotate-180"
            />
            
            {/* Right Side Flower - Hidden on mobile, visible on larger screens */}
            <img 
                src="/flower.png" 
                alt="Decorative Flower"
                className="lg:block absolute -right-12 md:-right-32 lg:-right-48 w-[250px] md:w-[600px] lg:w-[890px] h-auto opacity-70 z-0 transform"
            />
            
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Features Title */}
                <h1
                    id="features-title"
                    data-animate
                    className={`text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-piedra tracking-wider text-black text-center mb-16 sm:mb-16 md:mb-24 lg:mb-44 transform transition-all duration-1000 ease-out ${
                        visibleElements.has('features-title')
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                    Features
                </h1>

                {/* Features Grid */}
                <div className="space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-14">
                    {/* Text Notes */}
                    <div
                        id="text-notes"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 transform transition-all duration-700 ease-out ${
                            visibleElements.has('text-notes')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14,17H7V15H14M17,13H7V11H17M17,9H7V7H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="text-notes-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('text-notes-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Text Notes
                            </h3>
                            <ul
                                id="text-notes-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('text-notes-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Prefer typing? We've got that too.</li>
                                <li>• Add a title, write your heart out, save it.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Voice Entries */}
                    <div
                        id="voice-entries"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 lg:ml-[110px] transform transition-all duration-700 ease-out ${
                            visibleElements.has('voice-entries')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="voice-entries-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('voice-entries-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Voice Entries
                            </h3>
                            <ul
                                id="voice-entries-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('voice-entries-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Just press record and speak.</li>
                                <li>• Save thoughts without typing a word.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Photo Attachments */}
                    <div
                        id="photo-attachments"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 lg:ml-[220px] transform transition-all duration-700 ease-out ${
                            visibleElements.has('photo-attachments')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="photo-attachments-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('photo-attachments-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Photo Attachments
                            </h3>
                            <ul
                                id="photo-attachments-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('photo-attachments-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Add daily snaps or meaningful pics.</li>
                                <li>• One memory = one moment captured.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Secure Login */}
                    <div
                        id="secure-login"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 lg:ml-[330px] transform transition-all duration-700 ease-out ${
                            visibleElements.has('secure-login')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="secure-login-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('secure-login-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Secure Login
                            </h3>
                            <ul
                                id="secure-login-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('secure-login-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Sign in securely with Google.</li>
                                <li>• Fast, safe, and password-free login.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Timeline View */}
                    <div
                        id="timeline-view"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 lg:ml-[440px] transform transition-all duration-700 ease-out ${
                            visibleElements.has('timeline-view')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3 19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="timeline-view-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('timeline-view-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Timeline View
                            </h3>
                            <ul
                                id="timeline-view-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('timeline-view-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Scroll through your past like a storybook.</li>
                                <li>• Easily view entries by date.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Cloud Sync */}
                    <div
                        id="cloud-sync"
                        data-animate
                        className={`flex items-start justify-center lg:justify-start sm:space-x-4 lg:space-x-6 lg:ml-[600px] transform transition-all duration-700 ease-out ${
                            visibleElements.has('cloud-sync')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-8'
                        }`}>
                        <div className="bg-black rounded-lg p-2 sm:p-3 lg:p-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.35,10.04C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.04C2.34,8.36 0,10.91 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.04Z" />
                            </svg>
                        </div>
                        <div className="text-center sm:text-left">
                            <h3
                                id="cloud-sync-title"
                                data-animate
                                className={`text-lg sm:text-xl lg:text-2xl font-piedra tracking-wider text-black mb-2 sm:mb-3 transform transition-all duration-600 ease-out ${
                                    visibleElements.has('cloud-sync-title')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                Cloud Sync
                            </h3>
                            <ul
                                id="cloud-sync-list"
                                data-animate
                                className={`text-gray-700 space-y-1 text-sm sm:text-base transform transition-all duration-600 ease-out ${
                                    visibleElements.has('cloud-sync-list')
                                        ? 'opacity-100 translate-y-0'
                                        : 'opacity-0 translate-y-4'
                                }`}>
                                <li>• Access your diary from any device.</li>
                                <li>• Your data, always safe and backed up.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div
                    id="bottom-section"
                    data-animate
                    className={`text-center mt-12 sm:mt-16 md:mt-24 lg:mt-32 transform transition-all duration-1000 ease-out ${
                        visibleElements.has('bottom-section')
                            ? 'opacity-100 translate-y-0'
                            : 'opacity-0 translate-y-8'
                    }`}>
                    <h2
                        id="bottom-quote"
                        data-animate
                        className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-piedra tracking-wider text-black mb-4 sm:mb-6 lg:mb-8 px-4 transform transition-all duration-700 ease-out ${
                            visibleElements.has('bottom-quote')
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4'
                        }`}>
                        "Ready to keep your first memory?"
                    </h2>
                    <button
                        onClick={handleSignInClick}
                        className={`bg-black hover:bg-gray-800 text-white font-piedra tracking-wider py-2 sm:py-3 px-6 sm:px-8 text-sm sm:text-base rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 relative overflow-hidden group ${
                            'opacity-100 translate-y-0'
                        }`}>
                        <span className={`relative z-10 transition-all duration-300 ${
                            'opacity-100'
                        }`}>
                            Start Your Journey
                        </span>
                        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-transform duration-700 ease-out ${
                            '-translate-x-full opacity-100'
                        }`}></div>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Features
