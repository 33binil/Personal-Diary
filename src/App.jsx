import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Loading from './pages/Loading'
import Login from './pages/Login'
import Home from './pages/Home'
import User1 from './pages/User1'
import Profile1 from './pages/Profile1'
import Profile2 from "./pages/Profile2.jsx";
import Profile3 from "./pages/Profile3.jsx";
import User2 from "./pages/User2.jsx";
import User3 from "./pages/User3.jsx";
import Diary1 from "./pages/Diary1.jsx";
import Diary2 from "./pages/Diary2.jsx";
import Diary3 from "./pages/Diary3.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import TermsOfUse from "./pages/Termsofuse.jsx";
import About from './pages/About'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading for 2 seconds, then switch to home
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    // Cleanup timer on component unmount
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <InnerAppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  )
}

export default App

// Separate component so we can read auth context and render a top-level banner
function InnerAppRoutes() {
  const { needsDriveAuth, requestDriveAuthorization, user, loading } = useAuth();

  return (
    <>
      {user && needsDriveAuth && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b border-yellow-300 text-yellow-900 p-3 flex items-center justify-between">
          <div className="text-sm">
            This browser hasn't been granted Google Drive access. To load or save diary entries from Google Drive, please authorize Drive for this browser.
          </div>
          <div className="ml-4">
            <button
              onClick={() => requestDriveAuthorization()}
              className="bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
            >
              Authorize Google Drive
            </button>
          </div>
        </div>
      )}
      <div className="pt-0">
        {loading ? (
          <Loading />
        ) : (
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user1" element={<User1 />} />
            <Route path="/user2" element={<User2 />} />
            <Route path="/user3" element={<User3 />} />
            <Route path="/profile1" element={<Profile1 />} />
            <Route path="/profile2" element={<Profile2 />} />
            <Route path="/profile3" element={<Profile3 />} />
            <Route path="/diary1" element={<Diary1 />} />
            <Route path="/diary2" element={<Diary2 />} />
            <Route path="/diary3" element={<Diary3 />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfUse />} />
            {/* Redirect any unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </>
  )
}
