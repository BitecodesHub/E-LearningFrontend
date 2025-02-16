import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const LeaderBoard = () => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content takes all available space between Navbar and Footer */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="min-h-full flex flex-col items-center justify-center p-24">
            <div className="relative w-48 h-48 mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-white rounded-full" />
              <div className="absolute inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin" />
            </div>

            <h1 className="text-6xl font-black mb-8 p-10 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight animate-pulse">
              Coming Soon
            </h1>

            <div className="flex flex-row items-center justify-center space-x-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-100" />
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};
