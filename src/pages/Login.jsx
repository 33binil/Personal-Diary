import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { signInWithGoogle } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [step, setStep] = useState('initial'); // 'initial', 'accountSelected', 'loggingIn'
    const navigate = useNavigate();

    const handleGoogleAccountPicker = async () => {
        try {
            setIsLoading(true);
            setError('');
            
            // Real Firebase Google Sign In with account picker
            const user = await signInWithGoogle();
            
            // Set the selected user info
            setSelectedUser({
                email: user.email,
                name: user.displayName,
                photo: user.photoURL
            });
            
            setStep('accountSelected');
        } catch (error) {
            console.error('Google account selection failed:', error);
            setError('Failed to select Google account. Please set up Firebase first.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginWithSelectedAccount = async () => {
        try {
            setStep('loggingIn');
            setError('');
            
            // Show success message
            const userName = selectedUser.name.split(' ')[0]; // Get first name
            setError(`Hey, ${userName}!`);
            
            // Wait a moment to show the message, then redirect to User1
            setTimeout(() => {
                navigate('/user1');
            }, 2000);
            
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login failed. Please try again.');
            setStep('accountSelected');
        }
    };

    const resetSelection = () => {
        setSelectedUser(null);
        setStep('initial');
        setError('');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Background Image */}
            <img 
                src="/home.jpg" 
                alt="Login Background" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* 70% Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            <div className="relative max-w-md w-full space-y-12">
                {/* Logo and Title */}
                <div className="text-center">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl font-piedra tracking-wider text-white mb-8">
                        Personal Diary
                    </h1>
                    <p className="text-sm sm:text-base text-white mb-8">
                        Your private space for thoughts and memories
                    </p>
                </div>

                {/* Login Card */}
                <div className="relative flex justify-center items-center">
                    <div className="bg-white/90 w-80 md:w-full lg:w-full flex items-center justify-center relative backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8">
                        <div className="space-y-6">
                            <div className="text-center">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
                                    Welcome Back
                                </h2>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Sign in to access your diary
                                </p>
                            </div>

                            {/* Error/Success Message */}
                            {error && (
                                <div className={`${error.startsWith('Hey,') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg p-3 sm:p-4`}>
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            {error.startsWith('Hey,') ? (
                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="ml-2 sm:ml-3">
                                            <p className={`text-xs sm:text-sm ${error.startsWith('Hey,') ? 'text-green-800' : 'text-red-800'}`}>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'initial' && (
                                <>
                                    {/* Google Account Picker Button */}
                                    <button
                                        onClick={handleGoogleAccountPicker}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center px-4 py-3 sm:py-4 border border-transparent rounded-xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Loading accounts...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                                </svg>
                                                Continue with Google
                                            </>
                                        )}
                                    </button>
                                </>
                            )}

                            {step === 'accountSelected' && selectedUser && (
                                <>
                                    {/* Selected Account Display */}
                                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                        <div className="flex items-center space-x-3">
                                            <img 
                                                src={selectedUser.photo || '/default-avatar.png'} 
                                                alt="Profile" 
                                                className="w-10 h-10 rounded-full"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {selectedUser.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {selectedUser.email}
                                                </p>
                                            </div>
                                            <button
                                                onClick={resetSelection}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Login Button */}
                                    <button
                                        onClick={handleLoginWithSelectedAccount}
                                        disabled={step === 'loggingIn'}
                                        className="w-full flex items-center justify-center px-4 py-3 sm:py-4 border border-transparent rounded-xl text-sm sm:text-base font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
                                    >
                                        {step === 'loggingIn' ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                                </svg>
                                                Login with {selectedUser.email}
                                            </>
                                        )}
                                    </button>

                                    {/* Change Account Button */}
                                    <button
                                        onClick={handleGoogleAccountPicker}
                                        className="w-full mt-3 px-4 py-3 sm:py-3 rounded-xl text-sm sm:text-base font-medium text-red-600 bg-white hover:bg-gray-50 border border-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                                    >
                                        Choose different account
                                    </button>
                                </>
                            )}

                            {/* Security Note */}
                            <div className="text-center pt-4">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    🔒 Your data is encrypted and stored securely in your Google Drive
                                </p>
                            </div>
                        </div>
                    </div>
                </div>


                {/* Features Preview */}
                <div className="text-center space-y-4">
                    <p className="text-sm sm:text-base text-white font-medium">
                        Why choose Personal Diary?
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-white">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>Private & Secure</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>Voice Entries</span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span>Photo Memories</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
