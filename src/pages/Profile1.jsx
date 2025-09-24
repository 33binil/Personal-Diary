import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile1 = () => {
    const navigate = useNavigate();

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
                <div className="w-16 h-16 md:w-24 md:h-24 lg:w-[130px] lg:h-[130px] rounded-full bg-[#011B43] flex items-center justify-center text-white text-base md:text-lg lg:text-xl font-bold">
                </div>
                <div className="text-xl md:text-2xl lg:text-3xl font-piedra tracking-wider">
                    Binil B
                </div>
                {/* Name Row already included in circle */}
            </div>

            {/* Quote */}
            <div className="text-base md:text-lg lg:text-xl font-piedra tracking-wider mb-3 px-4 sm:px-6 lg:pl-80">"Quote...."</div>

            {/* Email */}
            <div className="text-xs sm:text-sm text-gray-300 mb-12 md:mb-16 lg:mb-24 px-4 sm:px-6 lg:pl-80">33binilb@gmail.com</div>

            {/* Large Image Box */}
            <div className="flex items-center justify-center px-4 sm:px-6">
                <div className="w-full max-w-[1546px] h-40 sm:h-56 md:h-64 lg:h-[314px] bg-gray-700 mb-12 md:mb-16 lg:mb-24 rounded-lg flex items-center justify-center">
                    <span>Image Box</span>
                </div>
            </div>


            {/* Themes Row */}
            <div className="flex items-center justify-center mt-8 md:mt-0 gap-4 px-4 sm:px-6">
                <span className="text-base md:text-lg font-piedra tracking-wider">Themes =</span>
                <div className="lg:grid-cols-3 gap-5 flex md:gap-4">
                    <button onClick={() => navigate('/user1')}>
                        <div className="w-50 md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] bg-gray-600 rounded-lg flex items-center justify-center">
                            Theme 1
                        </div>
                    </button>

                    <button onClick={() => navigate('/user2')}>
                        <div className="w-full md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] bg-gray-600 rounded-lg flex items-center justify-center">
                            Theme 2
                        </div>
                    </button>

                    <button onClick={() => navigate('/user3')}>
                        <div className="w-full md:w-[150px] h-28 sm:h-36 md:h-44 lg:w-[290px] lg:h-[186px] bg-gray-600 rounded-lg flex items-center justify-center">
                            Theme 3
                        </div>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Profile1;
