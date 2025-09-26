import React, { useEffect, useState } from "react";
import { User, Search, HelpCircle, LogOut } from "lucide-react"; // Icons
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Option1 = ({ open = false, onClose = () => {} }) => {
    const [animOpen, setAnimOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [pickedDate, setPickedDate] = useState('')

    useEffect(() => {
        if (open) {
            const id = requestAnimationFrame(() => setAnimOpen(true));
            return () => cancelAnimationFrame(id);
        } else {
            setAnimOpen(false);
        }
    }, [open]);

    return (
        <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
            {/* Sliding Panel with 70% transparency so User1 stays visible behind */}
            <div
                className={`absolute inset-0 bg-[#010C1E]/70 overflow-y-auto transform transition-transform duration-300 ease-out ${animOpen ? "translate-x-0" : "-translate-x-full"}`}
                onClick={(e) => {
                    // Close when clicking empty area of the panel (optional)
                    if (e.target === e.currentTarget) onClose();
                }}
            >
                {/* Content aligned from the left, full height */}
                <div className="h-full w-full flex flex-col">
                    {/* Top Box */}
                    <div className="bg-[#9D9D9D]/90 w-full md:max-w-[768px] lg:max-w-[1040px] h-64 sm:h-56 md:h-64 lg:h-[420px] flex items-center justify-center">
                        {/* Logo inside Top Box */}
                        <img
                            src="/logo.jpg"
                            alt="Logo"
                            className="w-40 md:w-52 object-contain"
                        />
                    </div>

                    {/* Bottom Menu Box */}
                    <div className="bg-[#011637]/90 w-full md:max-w-[768px] lg:max-w-[1040px] flex-1 px-6 py-6 md:px-12 md:py-10 lg:px-20 lg:py-12">
                        {/* User Info Section */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/20">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                {user?.photoURL ? (
                                    <img 
                                        src={user.photoURL} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-white font-bold">
                                        {user?.displayName ? user.displayName.charAt(0) : 'U'}
                                    </span>
                                )}
                            </div>
                            <div>
                                <p className="text-white font-piedra tracking-wider text-sm md:text-lg">
                                    {user?.displayName || 'User Name'}
                                </p>
                                <p className="text-white/70 text-xs md:text-sm">
                                    {user?.email || 'user@email.com'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Menu Items */}
                        <div className="flex flex-col text-[14px] md:text-xl lg:text-2xl font-piedra tracking-wider gap-4 md:gap-8 lg:gap-10 text-white">
                            {/* Profile */}
                            <button
                                onClick={() => navigate('/profile1')}
                                className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all"
                            >
                                <User className="w-6 h-6" />
                                Profile
                            </button>

                            {/* Search by Date */}
                            <div className="relative">
                                <button onClick={() => setShowDatePicker(v => !v)} className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all">
                                    <Search className="w-6 h-6" />
                                    Search by Date
                                </button>
                                {showDatePicker && (
                                    <div className="absolute left-0 mt-2 bg-[#01203a] border border-white/10 rounded-lg p-4 w-[260px] z-40">
                                        <label className="text-sm text-white/80 block mb-2">Select a date</label>
                                        <input
                                            type="date"
                                            value={pickedDate}
                                            onChange={(e) => setPickedDate(e.target.value)}
                                            className="w-full p-2 rounded bg-white/5 border border-white/10 text-white"
                                        />
                                        <div className="mt-3 flex justify-end gap-2">
                                            <button onClick={() => { setShowDatePicker(false); setPickedDate('') }} className="px-3 py-1 rounded bg-white/10">Cancel</button>
                                            <button onClick={() => {
                                                if (!pickedDate) return alert('Please choose a date')
                                                // navigate to the user page with date query
                                                navigate(`/user1?date=${pickedDate}`)
                                                setShowDatePicker(false)
                                                onClose()
                                            }} className="px-3 py-1 rounded bg-white/80 text-[#001331]">Go</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Help/About */}
                            <button onClick={() => { navigate('/about'); onClose() }} className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all">
                                <HelpCircle className="w-6 h-6" />
                                Help / About
                            </button>

                            {/* Logout */}
                            <button
                                onClick={async () => {
                                    try {
                                        await logout();
                                        navigate('/');
                                        onClose();
                                    } catch (error) {
                                        console.error('Logout failed:', error);
                                    }
                                }}
                                className="flex items-center gap-4 hover:bg-red-500/30 px-4 py-3 rounded-lg transition-all text-red-300 hover:text-red-200"
                            >
                                <LogOut className="w-6 h-6" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Option1;
