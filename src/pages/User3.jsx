import React, { useEffect, useMemo, useState } from "react";
import { Calendar, Plus, User, Trash2 } from "lucide-react"; // icons
import Option3 from "./Option3";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageIntroFade from "../components/PageIntroFade";

const User3 = () => {
    const [optionOpen, setOptionOpen] = useState(false);
    const { user, getAllDiaryEntries, driveInitialized, deleteDiaryEntry } = useAuth();
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [isLoadingEntries, setIsLoadingEntries] = useState(false);
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
        const load = async () => {
            setIsLoadingEntries(true)
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
                setIsLoadingEntries(false)
            }
        };
        load();
    }, [driveInitialized, getAllDiaryEntries]);

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
        <div className="h-screen w-full bg-[#121818] flex flex-col text-white relative overflow-hidden">
            {/* Intro overlay (fade in -> 1s hold -> fade out) */}
<PageIntroFade outOnly hold={500} fadeOut={300} />

            {/* Top Left 3 Lines */}
            <button
                onClick={() => setOptionOpen((v) => !v)}
                className="absolute top-6 left-6 z-[70] flex flex-col gap-2 focus:outline-none"
                aria-label="Open options"
            >
                <div className="h-[2px] w-[12px] bg-white transition-all duration-300"></div>
                <div className="h-[2px] w-[24px] bg-white transition-all duration-300"></div>
                <div className="h-[2px] w-[36px] bg-white transition-all duration-300"></div>
            </button>

            {/* Top theme removed per request */}
            <img
                src="/theme3.png"
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
                            <div key={date} className="bg-[#FCC37B] rounded-2xl p-5 md:p-7 px-6 md:px-24 w-full shadow-lg">
                                <div className="flex items-end gap-4 px-4 md:px-7">
                                    <div className="font-piedra tracking-wider text-2xl md:text-[36px] lg:text-[46px]">{day}</div>
                                    <div className="font-piedra tracking-wider text-sm md:text-[24px] lg:text-[27px]">{month}</div>
                                </div>
                                <div className="mt-4 flex flex-col gap-3">
                                    {items.map((it) => (
                                        <div key={it.id} className="bg-black/10 rounded-xl p-3 md:p-4 relative cursor-pointer hover:bg-white/5" onClick={() => navigate(`/diary3?openId=${encodeURIComponent(it.id)}`)}>
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
                <button className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#C89C64] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E5BD8B]">
                    <Calendar className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>

                {/* Center big button */}
                <button
                    onClick={() => navigate('/diary3')}
                    className="w-16 h-16 md:w-[120px] md:h-[120px] rounded-full bg-[#C89C64] flex items-center justify-center shadow-lg
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E5BD8B]">
                    <Plus className="text-white w-12 h-12 md:w-16 md:h-16" />
                </button>

                {/* Right small button */}
                <button
                    onClick={() => navigate('/profile3')}
                    className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#C89C64] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#E5BD8B]"
                >
                    <User className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>
            </div>


            {/* Option overlay inside same page */}
            <Option3 open={optionOpen} onClose={() => setOptionOpen(false)} />
        </div>
    );
};

export default User3;
