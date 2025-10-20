import React, { useEffect, useState } from "react";
import { User, Search, HelpCircle, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Option1 = ({ open = false, onClose = () => {} }) => {
    const [animOpen, setAnimOpen] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            const id = requestAnimationFrame(() => setAnimOpen(true));
            return () => cancelAnimationFrame(id);
        } else {
            setAnimOpen(false);
        }
    }, [open]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
            onClose();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleDateSelect = () => {
        if (selectedDate) {
            navigate(`/user1?date=${selectedDate}`);
            setShowDatePicker(false);
            onClose();
        }
    };

    if (!open && !animOpen) return null;

    return (
        <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}>
            {/* Glassmorphism Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${animOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />
            
            {/* Sliding Panel with Glassmorphism */}
            <div
                className={`fixed inset-y-0 left-0 w-4/5 max-w-md bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-out ${animOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Close Button */}
                <div className="flex justify-end p-4">
                    <button 
                        onClick={onClose}
                        className="text-white/70 hover:text-white p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* User Profile Section */}
                <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#0c2a5a]/30 flex items-center justify-center">
                            <User className="w-8 h-8 text-white/80" />
                        </div>
                        <div>
                            <h3 className="text-white font-medium">{user?.displayName || 'User'}</h3>
                            <p className="text-white/60 text-sm">{user?.email || ''}</p>
                        </div>
                    </div>
                </div>

                {/* Menu Items */}
                <div className="p-4 space-y-2">
                    <button
                        onClick={() => {
                            navigate('/profile1');
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0c2a5a]/30 transition-colors text-white/90 hover:text-white"
                    >
                        <User className="w-5 h-5" />
                        <span>Profile</span>
                    </button>

                    <button
                        onClick={() => setShowDatePicker(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0c2a5a]/30 transition-colors text-white/90 hover:text-white"
                    >
                        <Search className="w-5 h-5" />
                        <span>Search by Date</span>
                    </button>

                    <button
                        onClick={() => {
                            navigate('/about');
                            onClose();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#0c2a5a]/30 transition-colors text-white/90 hover:text-white"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span>Help / About</span>
                    </button>
                </div>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-[#0c2a5a]/30 hover:bg-[#0c2a5a]/40 text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Date Picker Modal with Blur Effect */}
            {showDatePicker && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowDatePicker(false)}
                    />
                    <div className="relative bg-[#1A1A2E]/90 backdrop-blur-xl rounded-2xl p-6 w-full max-w-md border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Select Date</h3>
                            <button 
                                onClick={() => setShowDatePicker(false)}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-[#0c2a5a] transition-all"
                            />
                            <button
                                onClick={handleDateSelect}
                                disabled={!selectedDate}
                                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                    selectedDate 
                                        ? 'bg-[#0c2a5a] text-white hover:bg-[#1a3b6e]' 
                                        : 'bg-white/5 text-white/50 cursor-not-allowed'
                                }`}
                            >
                                Go to Date
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Option1;