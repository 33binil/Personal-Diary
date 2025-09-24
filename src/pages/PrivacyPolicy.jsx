import React, {useState} from "react";
import { ArrowLeft } from "lucide-react";
import {useNavigate} from "react-router-dom";


const PrivacyPolicy = () => {
    const navigate = useNavigate()
    return (
        <div className="w-screen min-h-screen bg-[#000000] text-white px-4 sm:px-6 md:px-10 py-8 relative">
            {/* Exit button - top left */}
            <button
                onClick={() => navigate('/')}
                aria-label="Exit to Home"
                className="absolute top-4 left-4 z-10 p-2 rounded-lg hover:bg-white/10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>

            <div className="max-w-5xl mx-auto  rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 space-y-6">
                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Privacy Policy</h1>

                <p className="text-xs sm:text-sm text-gray-300">
                    Last updated:{" "}
                    <span className="text-gray-100">September 24, 2025</span>
                </p>

                {/* Section 1 */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Introduction</h2>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        Welcome — this app (Personal Diary) is a personal diary built for
                        private, multimedia journaling. The Service is not certified by any
                        authority and is provided “as-is”. This Privacy Policy explains what
                        data the app uses and how your diary content is stored.
                    </p>
                </section>

                {/* Section 2 */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Summary</h2>
                    <ul className="list-disc list-inside text-gray-200 text-sm sm:text-base leading-relaxed space-y-1">
                        <li>Google Sign-In is used for authentication.</li>
                        <li>
                            Diary entries (text, images, audio) are saved directly to your
                            Google Drive.
                        </li>
                        <li>No username/password storage — Google handles authentication.</li>
                        <li>We cannot and do not read your diary content.</li>
                    </ul>
                </section>

                {/* Authentication */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Authentication</h2>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        The Service uses Google OAuth for sign-in. We do not store passwords.
                        The app requests Google Drive access to save your diary files. You
                        can revoke permissions anytime from your Google Account settings.
                    </p>
                </section>

                {/* Storage */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        How Your Diary Is Stored
                    </h2>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        Diary entries are uploaded into a private folder in your Google
                        Drive. We only store references (file IDs). Files remain under your
                        control.
                    </p>
                </section>

                {/* Sharing */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Sharing</h2>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        By default, your diary is private. If you share Google Drive files
                        manually, they will follow Google’s sharing rules. We do not
                        automatically share anything.
                    </p>
                </section>

                {/* Contact */}
                <section className="space-y-2 sm:space-y-3">
                    <h2 className="text-lg sm:text-xl font-semibold">Contact</h2>
                    <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                        Questions? Email us at{" "}
                        <a
                            href="mailto:33binilb@gmail.com"
                            className="text-blue-300 underline"
                        >
                            33binilb@gmail.com
                        </a>
                    </p>
                </section>

                {/* Disclaimer */}
                <section className="text-xs sm:text-sm text-gray-400 italic leading-relaxed">
                    <p>
                        Disclaimer: This Privacy Policy is for informational purposes only
                        and not legally binding.
                    </p>
                </section>
            </div>

        </div>

    );
};

export default PrivacyPolicy;
