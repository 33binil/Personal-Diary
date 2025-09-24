import React from "react";
import {useNavigate} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

const TermsOfUse = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-[#000000] text-white min-h-screen flex justify-center items-start py-10 px-4 md:px-12">
            <button
                onClick={() => navigate('/')}
                aria-label="Exit to Home"
                className="absolute top-4 left-4 z-10 p-2 rounded-lg hover:bg-white/10"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="w-full max-w-5xl bg-[#000000] rounded-2xl shadow-lg p-6 md:p-12">
                {/* Heading */}
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
                    Terms of Use
                </h1>

                <div className="space-y-6 text-sm md:text-base leading-relaxed text-gray-200">
                    <p>
                        Welcome to our application. By accessing or using this app, you
                        agree to comply with and be bound by the following Terms of Use. If
                        you do not agree with these terms, please do not use our service.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">1. Use of the Service</h2>
                    <p>
                        Our application is designed as a personal diary and note-keeping
                        platform. You may use it only for lawful purposes and in accordance
                        with these Terms. You agree not to misuse or attempt to disrupt the
                        functionality of the service.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">2. User Accounts</h2>
                    <p>
                        We use Google Authentication for login. No manual IDs or passwords
                        are stored by us. By signing in, you agree to allow the app to
                        access your account details necessary for authentication.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">3. Data Storage</h2>
                    <p>
                        All entries, notes, and files are securely stored in your Google
                        Drive. We do not host your personal data on our own servers. You
                        are responsible for managing your Drive storage and access
                        permissions.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">4. Privacy</h2>
                    <p>
                        Your privacy is very important to us. Please refer to our Privacy
                        Policy page for details about how your data is handled and
                        protected.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">5. Limitation of Liability</h2>
                    <p>
                        We are not responsible for any data loss, unauthorized access, or
                        damages resulting from your use of this application. Please ensure
                        that you keep your Google account secure.
                    </p>

                    <h2 className="text-xl font-semibold mt-6">6. Changes to Terms</h2>
                    <p>
                        We reserve the right to update or modify these Terms of Use at any
                        time. Continued use of the app after changes indicates your
                        acceptance of the updated terms.
                    </p>

                    <p className="mt-6 text-center text-gray-400 text-sm">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUse;
