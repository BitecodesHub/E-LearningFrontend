import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { logout, isAuthenticated, userName,userFirstName } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLoginSignup = () => {
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          <a href="/" className="hover:text-indigo-600 transition-all">Learn Without Limits</a>
          </h1>

          {/* Navigation Links */}
          <div className="hidden sm:flex space-x-8">
            <a href="/courses" className="hover:text-indigo-600 transition-all">Courses</a>
            <a href="#" className="hover:text-indigo-600 transition-all">Paths</a>
            <a href="#" className="hover:text-indigo-600 transition-all">Community</a>
            <a href="#" className="hover:text-indigo-600 transition-all">Resources</a>
          </div>

          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              {/* User Button */}
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-all duration-200"
              >
                <span className="text-lg font-semibold">{userFirstName || "User"}</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <a href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center">
                    Profile
                  </a>
                  <a href="/mycertifications" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-center">
                    My Certifications
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={handleLoginSignup}
              className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              Login / Signup
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
