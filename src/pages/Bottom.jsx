import React from 'react'
import { Link } from 'react-router-dom'

const Bottom = () => {
    return (
        <div className="bg-[#E7BFA2] py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                {/* Main Layout: Mobile-first responsive design */}
                <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
                    {/* Logo Section - Top on mobile, Left on desktop */}
                    <div className="lg:w-1/3 flex justify-center lg:justify-start items-start">
                        <img 
                            src="/logo.jpg"
                            alt="Personal Diary Logo" 
                            className="w-32 h-auto sm:w-40 md:w-48 lg:w-56 xl:w-64"
                        />
                    </div>
                    
                    {/* Main Footer Content - Bottom on mobile, Right on desktop */}
                    <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
                            {/* Brand Section */}
                            <div className="text-center sm:text-left lg:text-left">
                                <h3 className="text-[24px] sm:text-2xl lg:text-2xl xl:text-3xl font-piedra tracking-wider text-black mb-3 sm:mb-4">
                                    Personal Diary
                                </h3>
                                <p className="text-gray-700 font-bold leading-relaxed text-[15px] sm:text-base">
                                    All your diary entries are private and stored only in your Google Drive.<br className="hidden sm:block" /> 
                                    No one else can see your diary — not even us.<br className="hidden sm:block" />
                                    Safe, private, and accessible anywhere you log in.<br className="hidden sm:block" />
                                    Your thoughts stay yours. Fully encrypted and private.
                                </p>
                            </div>
                            
                            {/* Quick Links & Contact Combined */}
                            <div className="text-center sm:text-center lg:text-right">
                                <h4 className="text-lg sm:text-xl font-semibold text-black mb-3 sm:mb-4">Quick Links</h4>
                                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                    <li>
                                        <a href="#" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
                                            Features
                                        </a>
                                    </li>
                                    <li>
<Link to="/privacy" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
<Link to="/terms" className="text-gray-700 hover:text-black transition-colors text-sm sm:text-base">
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                                

                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Bottom Bar */}
                <div className="border-t border-black/20 pt-6 sm:pt-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <p className="text-gray-700 text-xs sm:text-sm text-center sm:text-left">
                            © 2025 Personal Diary. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
                            <a href="#" className="text-gray-700 hover:text-black text-xs sm:text-sm transition-colors">
                                Privacy
                            </a>
<Link to="/terms" className="text-gray-700 hover:text-black text-xs sm:text-sm transition-colors">
                                Terms
                            </Link>
                            <a href="#" className="text-gray-700 hover:text-black text-xs sm:text-sm transition-colors">
                                Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Bottom
