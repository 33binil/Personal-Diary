import React, { useState } from "react";
import { Calendar, Plus, User } from "lucide-react"; // icons
import Option1 from "./Option1";
import { useNavigate } from "react-router-dom";
import PageIntroFade from "../components/PageIntroFade";

const User1 = () => {
    const [optionOpen, setOptionOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full bg-[#010C1E] flex flex-col text-white relative overflow-hidden">
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

            {/* Top Theme Image */}
            <img
                src="/theme1.png"
                alt="Theme"
                className="w-full object-cover h-40 sm:h-56 md:h-auto"
            />

            {/* Year Text */}
            <h1 className="font-piedra mt-6 px-6 md:px-24 text-2xl md:text-[32px]">2025</h1>

            {/* Date Box */}
            <div className="items-center flex justify-center">
                <div className="bg-[#011B43] rounded-2xl p-5 md:p-7 px-6 md:px-24 w-full max-w-[1750px] mt-6 shadow-lg">
                    {/* Date Row */}
                    <div className="flex items-end gap-4 px-4 md:px-7">
                        <div className="font-piedra tracking-wider text-2xl md:text-[36px] lg:text-[46px]">07</div>
                        <div className="font-piedra tracking-wider text-sm md:text-[24px] lg:text-[27px]">April</div>
                    </div>

                    {/* Title */}
                    <div className="font-piedra tracking-wider mt-4 text-xl md:text-[32px] lg:text-[44px]">
                        Best Moment !
                    </div>

                    {/* Description */}
                    <div className="mt-1 text-[12px] md:text-[18px] lg:text-[22px]">
                        What Happens Today............
                    </div>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-center mt-[340px] md:mt-[530px] lg:mt-44 gap-10 md:gap-20 xl:gap-44">
                {/* Left small button */}
                <button className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#011B43] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#022a6b]">
                    <Calendar className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>

                {/* Center big button */}
                <button
                    onClick={() => navigate('/diary1')}
                    className="w-16 h-16 md:w-[120px] md:h-[120px] rounded-full bg-[#011B43] flex items-center justify-center shadow-lg
            transition-all duration-300 transform hover:scale-110 hover:bg-[#022a6b]">
                    <Plus className="text-white w-12 h-12 md:w-16 md:h-16" />
                </button>

                {/* Right small button */}
                <button
                    onClick={() => navigate('/profile1')}
                    className="w-10 h-10 md:w-[60px] md:h-[60px] rounded-full bg-[#011B43] flex items-center justify-center
            transition-all duration-300 transform hover:scale-110 hover:bg-[#022a6b]"
                >
                    <User className="text-white w-4 h-4 md:w-6 md:h-6" />
                </button>
            </div>



            {/* Option overlay inside same page */}
            <Option1 open={optionOpen} onClose={() => setOptionOpen(false)} />
        </div>
    );
};

export default User1;
