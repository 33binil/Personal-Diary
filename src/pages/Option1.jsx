import React, { useEffect, useState } from "react";
import { User, Search, HelpCircle, LogOut } from "lucide-react"; // Icons
import { useNavigate } from "react-router-dom";

const Option1 = ({ open = false, onClose = () => {} }) => {
    const [animOpen, setAnimOpen] = useState(false);
    const navigate = useNavigate();

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
                            <button className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all">
                                <Search className="w-6 h-6" />
                                Search by Date
                            </button>

                            {/* Help/About */}
                            <button className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all">
                                <HelpCircle className="w-6 h-6" />
                                Help / About
                            </button>

                            {/* Logout */}
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-4 hover:bg-[#0c2a5a]/70 px-4 py-3 rounded-lg transition-all">
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
