import React from "react";
import { Link } from "react-router-dom";

const StartPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 bg-black text-white">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">ClassGPT</h1>
      </div>
      <div className="text-center max-w-lg px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Welcome to ClassGPT</h2>

        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          ClassGPT is your AI-powered study assistant, designed to revolutionize learning.
        </p>
        <ul className="text-gray-400 text-sm sm:text-base mt-4 space-y-2 text-left sm:text-center">
          <li>📚 Convert lectures into structured notes.</li>
          <li>🎙️ Transcribe & summarize classroom discussions.</li>
          <li>🔍 Provide in-depth topic explanations with examples.</li>
          <li>🌍 Supports multiple languages, including Hindi & English.</li>
          <li>🚀 Enhance your studies with AI-driven insights!</li>
        </ul>
        <Link to="/login">
          <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StartPage;
