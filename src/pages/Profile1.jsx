import React, { useState } from "react";
import { ArrowLeft, Edit2, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuoteEditor from "../components/QuoteEditor";

const Profile1 = () => {
    const navigate = useNavigate();
    const { user, updateUserName } = useAuth();
    const [driveCheck, setDriveCheck] = useState(null);
    const [isEditingName, setIsEditingName] = useState(false);
    const [newName, setNewName] = useState(user?.displayName || '');
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSaveName = async () => {
        if (newName.trim() === '') return;
        
        setIsUpdating(true);
        try {
            await updateUserName(newName.trim());
            setIsEditingName(false);
        } catch (error) {
            console.error('Failed to update name:', error);
            // Reset to original name if failed
            setNewName(user?.displayName || '');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setNewName(user?.displayName || '');
        setIsEditingName(false);
    };

    const handleDriveCheck = async () => {
        const mod = await import('../services/googleDriveService.js');
        const r = await mod.default.debugCheck();
        setDriveCheck(r);
    };

    return (
        <div className="w-screen h-screen bg-[#000B1D] flex flex-col text-white p-4 sm:p-6 overflow-auto">

            {/* Top Left Back */}
            <button
                onClick={() => navigate('/user1')}
            >
                <div className="flex items-center gap-2 mb-20 cursor-pointer">
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-lg font-piedra tracking-wider"> Diary </span>
                </div>
            </button>


            {/* Profile Circle + Name */}
            <div className="flex items-center gap-4 sm:gap-6 mb-4 px-4 sm:px-6 lg:pl-44">
                <div className="w-16 h-16 md:w-24 md:h-24 lg:w-[130px] lg:h-[130px] rounded-full bg-[#011B43] flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                        <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-base md:text-lg lg:text-xl font-bold">
                            {user?.displayName ? user.displayName.charAt(0) : 'U'}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {isEditingName ? (
                        <div className="flex items-center gap-2">
                            <input 
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="bg-[#011B43] text-white text-xl md:text-2xl lg:text-3xl font-piedra tracking-wider px-3 py-1 rounded border border-white/30 focus:border-white focus:outline-none"
                                disabled={isUpdating}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                            />
                            <button 
                                onClick={handleSaveName}
                                disabled={isUpdating || newName.trim() === ''}
                                className="text-green-400 hover:text-green-300 disabled:text-gray-500"
                            >
                                {isUpdating ? (
                                    <div className="w-5 h-5 animate-spin border-2 border-green-400 border-t-transparent rounded-full"></div>
                                ) : (
                                    <Check className="w-5 h-5" />
                                )}
                            </button>
                            <button 
                                onClick={handleCancelEdit}
                                disabled={isUpdating}
                                className="text-red-400 hover:text-red-300 disabled:text-gray-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="text-xl md:text-2xl lg:text-3xl font-piedra tracking-wider">
                                {user?.displayName || 'User Name'}
                            </span>
                            <button 
                                onClick={() => setIsEditingName(true)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <Edit2 className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="text-xs sm:text-sm text-gray-300 mb-20 md:mb-16 lg:mb-24 px-4 sm:px-6 lg:pl-80">{user?.email || 'user@email.com'}</div>

            {/* Large Image Box with responsive images and overlay */}
            <div className="flex items-center justify-center px-4 sm:px-6 mb-10">
                <div className="w-full max-w-[1546px] h-40 sm:h-56 md:h-64 lg:h-[314px] mb-12 md:mb-16 lg:mb-24 rounded-lg overflow-hidden relative">
                    {/* mobile image */}
                    <img src="/theme1.png" alt="Large mobile" className="block sm:hidden w-full h-full object-cover" />
                    {/* desktop image */}
                    <img src="/theme1.png" alt="Large desktop" className="hidden sm:block w-full h-full object-cover" />

                    {/* 40% black overlay */}
                    <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                    {/* Quote editor positioned on top */}
                    <div className="absolute inset-0 flex items-start justify-center p-6 pointer-events-auto">
                        <QuoteEditor user={user} />
                    </div>
                </div>
            </div>

            {/* Themes Row */}
            <div className="flex items-center justify-center mt-8 md:mt-0 gap-4 px-4 sm:px-6">
                <span className="text-base md:text-lg font-piedra tracking-wider">Themes =</span>
                <div className="lg:grid-cols-3 gap-5 flex md:gap-4">
                    <button onClick={() => navigate('/user1')}> 
                        <div className="w-50 md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] rounded-lg overflow-hidden">
                            {/* mobile */}
                            <img src="/thm1.png" alt="Theme 1 mobile" className="block sm:hidden w-full h-full object-cover" />
                            {/* desktop */}
                            <img src="/thw1.png" alt="Theme 1 desktop" className="hidden sm:block w-full h-full object-cover" />
                        </div>
                    </button>

                    <button onClick={() => navigate('/user2')}> 
                        <div className="w-full md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] rounded-lg overflow-hidden">
                            <picture>
                                <source media="(max-width:640px)" srcSet="/thm2.png" />
                                <img src="/thw2.png" alt="Theme 2" className="w-full h-full object-cover" />
                            </picture>
                        </div>
                    </button>

                    <button onClick={() => navigate('/user3')}> 
                        <div className="w-full md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] rounded-lg overflow-hidden">
                            <picture>
                                <source media="(max-width:640px)" srcSet="/thm3.png" />
                                <img src="/thw3.png" alt="Theme 3" className="w-full h-full object-cover" />
                            </picture>
                        </div>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Profile1;
