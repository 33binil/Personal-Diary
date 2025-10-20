import React, { useState } from "react";
import { ArrowLeft, Edit2, Check, X, User, Mail, Palette } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import QuoteEditor from "../components/QuoteEditor";

const Profile3 = () => {
    const navigate = useNavigate();
    const { user, updateUserName } = useAuth();
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
            setNewName(user?.displayName || '');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancelEdit = () => {
        setNewName(user?.displayName || '');
        setIsEditingName(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 flex flex-col text-white p-4 sm:p-6 overflow-auto">

            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-8 sm:mb-12">
                <button
                    onClick={() => navigate('/user3')}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Diary</span>
                </button>

                <div className="text-sm text-gray-300">
                    Profile Settings
                </div>
            </div>

            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 mb-8 sm:mb-12 px-4">
                {/* Profile Avatar */}
                <div className="relative">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center overflow-hidden shadow-2xl ring-4 ring-white/20">
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold">
                                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                            </span>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-emerald-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center sm:text-left">
                    {isEditingName ? (
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="bg-white/10 backdrop-blur-sm text-white text-xl sm:text-2xl lg:text-3xl font-semibold px-4 py-2 rounded-xl border border-white/30 focus:border-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    disabled={isUpdating}
                                    placeholder="Enter your name"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                                />
                                <button
                                    onClick={handleSaveName}
                                    disabled={isUpdating || newName.trim() === ''}
                                    className="p-2 rounded-lg bg-green-500 hover:bg-green-600 disabled:bg-gray-600 transition-colors"
                                >
                                    {isUpdating ? (
                                        <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                                    ) : (
                                        <Check className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    disabled={isUpdating}
                                    className="p-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 justify-center sm:justify-start">
                                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                    {user?.displayName || 'User Name'}
                                </h1>
                                <button
                                    onClick={() => setIsEditingName(true)}
                                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-200 group"
                                >
                                    <Edit2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-gray-300 justify-center sm:justify-start">
                                <Mail className="w-4 h-4" />
                                <span className="text-sm sm:text-base">{user?.email || 'user@email.com'}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quote Section */}
            <div className="flex items-center justify-center px-4 sm:px-6 mb-8 sm:mb-12">
                <div className="w-full max-w-4xl h-48 sm:h-64 lg:h-80 rounded-2xl overflow-hidden relative bg-gradient-to-br from-emerald-600/20 to-teal-600/20 backdrop-blur-sm border border-white/10">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>

                    {/* Quote Editor */}
                    <div className="absolute inset-0 flex items-center justify-center p-6">
                        <QuoteEditor user={user} />
                    </div>
                </div>
            </div>

            {/* Theme Selection */}
            <div className="px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Palette className="w-6 h-6 text-emerald-400" />
                        <h2 className="text-xl sm:text-2xl font-semibold">Choose Your Theme</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Theme 1 */}
                        <button
                            onClick={() => navigate('/user1')}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                            <div className="aspect-[16/10] relative">
                                <img
                                    src="/thw1.png"
                                    alt="Ocean Theme"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-semibold text-lg">Midnight Whispers</h3>
                                    <p className="text-gray-300 text-sm">Where calm meets mystery in the stillness of night.</p>
                                </div>
                            </div>
                        </button>

                        {/* Theme 2 */}
                        <button
                            onClick={() => navigate('/user2')}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                            <div className="aspect-[16/10] relative">
                                <img
                                    src="/thw2.png"
                                    alt="Sunset Theme"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-semibold text-lg">Crimson Dusk</h3>
                                    <p className="text-gray-300 text-sm">Where fading light holds unspoken stories.</p>
                                </div>
                            </div>
                        </button>

                        {/* Theme 3 */}
                        <button
                            onClick={() => navigate('/user3')}
                            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-300 border border-white/10 hover:border-white/20"
                        >
                            <div className="aspect-[16/10] relative">
                                <img
                                    src="/thw3.png"
                                    alt="Forest Theme"
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <h3 className="text-white font-semibold text-lg">Seaside Stillness</h3>
                                    <p className="text-gray-300 text-sm">Where the waves pause and hearts listen.</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Bottom spacing */}
            <div className="h-8"></div>
        </div>
    );
};

export default Profile3;
