import React from "react";
import { ArrowLeft } from "lucide-react"; // back arrow icon
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0B1220] text-white p-6 md:p-12 relative">
      {/* 🔙 Back button */}
      <button
        onClick={() => navigate(-1)} // go back to previous page
        className="absolute top-6 left-6 flex items-center gap-2 text-white hover:text-yellow-300 transition"
      >
        <ArrowLeft size={22} />
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="max-w-3xl mx-auto bg-[#01131f] rounded-xl p-8 shadow-lg mt-12">
        <h1 className="text-3xl font-semibold mb-4">About Personal Diary</h1>
        <p className="mb-3">
          Personal Diary is a private journaling app that lets you save encrypted
          diary entries to your Google Drive and keep lightweight metadata on our
          server.
        </p>
        <p className="mb-3">Features:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Save text, images and audio recordings.</li>
          <li>Entries are encrypted before uploading to your Google Drive.</li>
          <li>Quick access to past entries by date.</li>
          <li>Profile and personalization options.</li>
        </ul>
        <p className="text-sm text-white/70">
          If you need help, contact the developer or check the README in the project root.
        </p>
        <p className="mt-4 text-sm">
          Contact:{" "}
          <a
            href="mailto:33binib@gmail.com"
            className="text-yellow-300 underline"
          >
            33binib@gmail.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
