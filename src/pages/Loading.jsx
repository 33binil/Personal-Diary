import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative">
        {/* Rotating container */}
        <div className="animate-spin-slow relative w-20 h-20">
          {/* Dot 0 - Top */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#917B5E] rounded-full animate-pulse-0"></div>
          
          {/* Dot 1 - Right */}
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#917B5E] rounded-full animate-pulse-1"></div>
          
          {/* Dot 2 - Bottom */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-[#917B5E] rounded-full animate-pulse-2"></div>
          
          {/* Dot 3 - Left */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#917B5E] rounded-full animate-pulse-3"></div>
        </div>
        
        {/* Loading text */}
        <div className="text-center mt-8">
          <p className="text-white text-lg font-medium animate-pulse">Loading...</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes pulse-dot-0 {
          0%, 75%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          0%, 25% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes pulse-dot-1 {
          0%, 75%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          25%, 50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes pulse-dot-2 {
          0%, 75%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50%, 75% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes pulse-dot-3 {
          0%, 25%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          75%, 100% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .animate-pulse-0 {
          animation: pulse-dot-0 2s ease-in-out infinite;
        }
        
        .animate-pulse-1 {
          animation: pulse-dot-1 2s ease-in-out infinite;
        }
        
        .animate-pulse-2 {
          animation: pulse-dot-2 2s ease-in-out infinite;
        }
        
        .animate-pulse-3 {
          animation: pulse-dot-3 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Loading;