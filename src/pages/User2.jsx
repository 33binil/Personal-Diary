import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, User, Trash2, Settings } from "lucide-react"; // icons
import Option2 from "./Option2";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageIntroFade from "../components/PageIntroFade";

const User2 = () => {
    const [optionOpen, setOptionOpen] = useState(false);
    const { user, getAllDiaryEntries, driveInitialized, deleteDiaryEntry } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [entries, setEntries] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);
    const [showCalendarOverlay, setShowCalendarOverlay] = useState(false);
    const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);
    const [showSavingPopup, setShowSavingPopup] = useState(false);

    // Show saving popup immediately when coming from a save action
    useEffect(() => {
        if (location.state?.action) {
            setShowSavingPopup(true);
            const timer = setTimeout(() => setShowSavingPopup(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [location.state?.action]);
    const handleDeleteEntry = async (entryId) => {
        const entry = entries.find(e => e.id === entryId);
        if (entry && entry.fileId) {
            try {
                await deleteDiaryEntry(entry.fileId);
            } catch (e) {
                console.error('Failed to delete remote entry', e);
            }
        }

        setEntries((prev) => {
            const updated = prev.filter((e) => e.id !== entryId);
            if (entryId && entryId.endsWith('_local')) {
                try {
                    const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]');
                    const filtered = local.filter((e) => e.id !== entryId);
                    localStorage.setItem('DIARY_LOCAL_ENTRIES', JSON.stringify(filtered));
                } catch {}
            }
            return updated;
        });
    };

    useEffect(() => {
        const load = async (showLoading = true) => {
            if (showLoading) setIsLoadingEntries(true);
            try {
                const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]')
                let cloud = []
                if (driveInitialized) {
                    cloud = await getAllDiaryEntries();
                }
                if (cloud && cloud.length > 0) {
                    try {
                        const seen = new Map();
                        for (const e of cloud) {
                            const key = e.fileId || e.id || `${e.date}__${(e.title||'').trim()}__${(e.content||'').trim()}`;
                            if (!seen.has(key)) seen.set(key, e);
                        }
                        setEntries(Array.from(seen.values()));
                    } catch (dedupeErr) {
                        console.warn('Failed to dedupe cloud entries', dedupeErr);
                        setEntries(cloud);
                    }
                } else {
                    setEntries(local)
                }
            } catch (e) {
                console.error('Failed to load diary entries', e);
                try {
                    const local = JSON.parse(localStorage.getItem('DIARY_LOCAL_ENTRIES') || '[]')
                    setEntries(local)
                } catch {}
            } finally {
                setIsLoadingEntries(false);
            }
        };
        load(true);
    }, [driveInitialized, getAllDiaryEntries, location.key, location.state?.timestamp, location.state?.key]);

    useEffect(() => {
        if (location.state?.action === 'create' && location.state.newEntry) {
            setEntries(prev => [location.state.newEntry, ...prev]);
        } else if (location.state?.action === 'edit' && location.state.oldId && location.state.newEntry) {
            setEntries(prev => prev.map(e => e.id === location.state.oldId ? location.state.newEntry : e));
        }
    }, [location.state?.action, location.state?.newEntry, location.state?.oldId]);

    useEffect(() => {
        if (location.state?.timestamp) {
            setRefreshTrigger(prev => prev + 1);
        }
    }, [location.state?.timestamp]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            setShowRefreshConfirm(true);
            return '';
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, []);

    const entriesByDate = useMemo(() => {
        const map = new Map();
        for (const it of entries) {
            const d = it.date; // YYYY-MM-DD
            if (!map.has(d)) map.set(d, []);
            map.get(d).push(it);
        }
        return Array.from(map.entries())
            .sort((a, b) => (a[0] < b[0] ? 1 : -1))
            .map(([date, items]) => ({ date, items }));
    }, [entries]);

    return (
        <div className="min-h-screen w-full bg-[#D66D81] flex flex-col text-white relative overflow-hidden">
            {/* Intro overlay (fade in -> 1s hold -> fade out) */}
<PageIntroFade outOnly hold={500} fadeOut={300} />

            {/* Top Left Settings Icon */}
            <button
                onClick={() => setOptionOpen((v) => !v)}
                className="absolute top-6 left-6 z-[70] flex items-center justify-center focus:outline-none"
                aria-label="Open options"
            >
                <Settings className="w-6 h-6 text-white" />
            </button>

            {/* Top theme removed per request */}
            <img
                src="/theme2.png"
                alt="Theme"
                className="w-full object-cover h-40 sm:h-56 md:h-auto"
            />

            {/* User Name & Year Text */}
            <div className="mt-6 px-6 md:px-24">
                <h1 className="font-piedra text-2xl md:text-[32px] mb-2">
                    {user?.displayName ? `Hey, ${user.displayName.split(' ')[0]}!` : 'Welcome!'}
                </h1>
                <h2 className="font-piedra text-xl md:text-[24px] opacity-80">2025</h2>
            </div>

            {isLoadingEntries && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60">
                    <div className="bg-white/10 text-white rounded-xl p-6 flex flex-col items-center gap-3">
                        <div className="animate-spin border-4 border-white/30 border-t-white rounded-full w-12 h-12"></div>
                        <div>Loading Diary...</div>
                    </div>
                </div>
            )}

            {/* Date Boxes (dynamic) */}
            <div className="items-center flex justify-center">
                <div className="w-full max-w-[1750px] mt-6 flex flex-col gap-4">
                    {entriesByDate.length === 0 && (
                        <div className="text-center opacity-70">No entries yet. Tap + to write your first diary.</div>
                    )}
                    {entriesByDate.map(({ date, items }) => {
                        const dObj = new Date(date + 'T00:00:00');
                        const day = dObj.getDate().toString().padStart(2, '0');
                        const month = dObj.toLocaleDateString('en-US', { month: 'long' });
                        return (
                            <div key={date} className="bg-[#C8354C] rounded-2xl p-5 md:p-7 px-6 md:px-24 w-full shadow-lg">
                                <div className="flex items-end gap-4 px-4 md:px-7">
                                    <div className="font-piedra tracking-wider text-2xl md:text-[36px] lg:text-[46px]">{day}</div>
                                    <div className="font-piedra tracking-wider text-sm md:text-[24px] lg:text-[27px]">{month}</div>
                                </div>
                                <div className="mt-4 flex flex-col gap-3">
                                    {items.map((it) => (
                                        <div key={it.id} className="bg-black/10 rounded-xl p-3 md:p-4 relative cursor-pointer hover:bg-white/5" onClick={() => navigate(`/diary2?openId=${encodeURIComponent(it.id)}`)}>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleDeleteEntry(it.id) }}
                                                className="absolute top-2 right-2 p-1 rounded-md hover:bg-white/20"
                                                aria-label="Delete entry"
                                                title="Delete entry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="font-piedra tracking-wider text-lg md:text-[24px] pr-8">
                                                {it.title || 'Untitled'}
                                            </div>
                                            <div className="mt-1 text-[12px] md:text-[16px] lg:text-[18px] line-clamp-2 opacity-90 pr-8">
                                                {it.content || ''}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Buttons - fixed at bottom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center gap-10 md:gap-20 xl:gap-44">
                {/* Left small button */}
                <button onClick={() => setShowCalendarOverlay(true)} className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#CC3048] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E1596E]">
                    <Calendar className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>

                {/* Center big button */}
                <button
                    onClick={() => navigate('/diary2')}
                    className="w-16 h-16 md:w-[120px] md:h-[120px] rounded-full bg-[#CC3048] flex items-center justify-center shadow-lg
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E1596E]">
                    <Plus className="text-white w-12 h-12 md:w-16 md:h-16" />
                </button>

                {/* Right small button */}
                <button
                    onClick={() => navigate('/profile2')}
                    className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#CC3048] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E1596E]"
                >
                    <User className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>
            </div>

            {/* Calendar Overlay Modal */}
            {showCalendarOverlay && (
                <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#CC3048]/10 backdrop-blur-lg rounded-2xl p-6 w-[92%] max-w-2xl border border-white/20 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white text-xl font-semibold">Select date</h3>
                            <button 
                                onClick={() => setShowCalendarOverlay(false)} 
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <label className="text-white/80 text-sm font-medium mb-2 block">Pick a date</label>
                                <input 
                                    type="date" 
                                    className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#CC3048] transition-all duration-200"
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        if (!v) return;
                                        setShowCalendarOverlay(false);
                                        navigate(`/user2?date=${v}`);
                                    }}
                                />
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                                <label className="text-white/80 text-sm font-medium mb-2 block">Your entries</label>
                                <div className="max-h-64 overflow-y-auto pr-2 -mr-2">
                                    {entriesByDate.length === 0 ? (
                                        <div className="text-white/60 text-center py-6">No entries yet</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {entriesByDate.map(ed => (
                                                <button 
                                                    key={ed.date}
                                                    onClick={() => { 
                                                        setShowCalendarOverlay(false);
                                                        navigate(`/user2?date=${ed.date}`);
                                                    }}
                                                    className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/5 hover:border-white/20 flex justify-between items-center"
                                                >
                                                    <span className="font-medium text-white">
                                                        {new Date(ed.date + 'T00:00:00').toLocaleDateString(undefined, {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                    <span className="text-xs bg-[#CC3048]/20 text-[#CC3048] px-2 py-1 rounded-full">
                                                        {ed.items.length} entr{ed.items.length === 1 ? 'y' : 'ies'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Refresh confirmation modal */}
            {showRefreshConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70">
                    <div className="bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-sm text-center">
                        <p className="mb-4">Refreshing will log you out. Are you sure?</p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => { setShowRefreshConfirm(false); window.location.reload(); }} className="px-4 py-2 bg-red-500 text-white rounded">OK</button>
                            <button onClick={() => setShowRefreshConfirm(false)} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Saving to cloud popup - shown at top when coming from diary page */}
            {showSavingPopup && (
                <div className="fixed top-0 left-0 right-0 z-[100] flex justify-center pt-4">
                    <div className="bg-white text-[#001331] rounded-lg px-6 py-3 shadow-lg w-[95%] max-w-md text-center animate-slideDown">
                        <div className="font-semibold text-base">Saving to Google Drive...</div>
                        <div className="text-xs opacity-80">
                            Syncing may take time depending on your network. Updated diary will appear soon.
                        </div>
                    </div>
                </div>
            )}

            {/* Option overlay inside same page */}
            <Option2 open={optionOpen} onClose={() => setOptionOpen(false)} />
        </div>
    );
};

export default User2;
