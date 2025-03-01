import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Award, Clock, LogOut } from "lucide-react";

export const Navbar = () => {
  const { logout, isAuthenticated, userFirstName } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        event.target.id !== "mobile-menu-button"
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigation links array for DRY code
  const navLinks = [
    { title: "Courses", path: "/courses" },
    { title: "LeaderBoard", path: "/leaderboard" },
    { title: "Credential", path: "/credential-verify" },
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-lg">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
         {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            <a
              href="/"
              className="hover:scale-105 transition-transform duration-300 flex items-center"
            >
              Learn Without Limits
            </a>
          </h1>
        </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 transition-all duration-200"
              >
                {link.title}
              </a>
            ))}
          </div>

          {/* Authentication Section for Desktop */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="relative ml-3" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all duration-200"
                >
                  <span className="font-medium mr-1">
                    {userFirstName || "User"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                    <div className="py-2">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-all"
                      >
                        <User size={18} className="mr-3 text-indigo-500" />
                        <span>Profile</span>
                      </a>
                      <a
                        href="/certificates"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-all"
                      >
                        <Award size={18} className="mr-3 text-indigo-500" />
                        <span>My Certifications</span>
                      </a>
                      <a
                        href="/attempts"
                        className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 transition-all"
                      >
                        <Clock size={18} className="mr-3 text-indigo-500" />
                        <span>Attempts</span>
                      </a>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut size={18} className="mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLoginSignup}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Login / Signup
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            id="mobile-menu-button"
            onClick={toggleMobileMenu}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none transition-all duration-200"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="block h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 max-h-screen"
            : "opacity-0 -translate-y-4 max-h-0 overflow-hidden"
        } bg-white border-t border-gray-100 shadow-inner`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className="block px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Mobile Authentication Menu */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="px-2 space-y-1">
              <div className="px-4 py-2 text-center">
                <span className="text-lg font-medium text-indigo-600">
                  Hi, {userFirstName || "User"}!
                </span>
              </div>
              <a
                href="/profile"
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <User size={18} className="mr-3 text-indigo-500" />
                <span>Profile</span>
              </a>
              <a
                href="/certificates"
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <Award size={18} className="mr-3 text-indigo-500" />
                <span>My Certifications</span>
              </a>
              <a
                href="/attempts"
                className="flex items-center px-4 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <Clock size={18} className="mr-3 text-indigo-500" />
                <span>Attempts</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center w-full mt-4 px-4 py-3 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
              >
                <LogOut size={18} className="mr-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="px-5 py-4 flex justify-center">
              <button
                onClick={handleLoginSignup}
                className="w-full px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
              >
                Login / Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};