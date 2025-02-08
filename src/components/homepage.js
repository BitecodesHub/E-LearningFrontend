import { DiJava, DiReact } from "react-icons/di"; // Java & React icons
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si"; // Python, MySQL, MongoDB, Rust, C++;
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

 // Python icon

export const HomePage = () => {
  const { logout, isAuthenticated, userEmail, userName } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  const courses = [
    { title: "Python", desc: "Learn Python from basics to advanced concepts.", icon:<SiPython size={50} color="#306998" /> },
    { title: "Java", desc: "Master Java with comprehensive courses.", icon: <DiJava size={50} color="#007396" /> },
    { title: "C++", desc: "Deep dive into C++ programming.", icon: <SiCplusplus size={50} color="#00599C" /> },
    { title: "MySQL", desc: "Master relational databases with MySQL.", icon: <SiMysql size={50} color="#4479A1" /> },
    { title: "MongoDB", desc: "Learn NoSQL database with MongoDB.", icon: <SiMongodb size={50} color="#47A248" /> },
    { title: "Rust", desc: "Get started with Rust programming.", icon: <SiRust size={50} color="#DEA584" /> },
    { title: "React", desc: "Build modern web applications with React.", icon: <DiReact size={50} color="#61DAFB" /> }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-20">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight py-5">
            Master Programming Today
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            Learn programming at your own pace with expert-led courses and hands-on projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200 transform hover:scale-105">
              <a href="/courses">Explore Courses</a>
            </button>
            <button className="px-8 py-3 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-all duration-200 transform hover:scale-105">
              View Learning Paths
            </button>
          </div>
        </section>

        {/* Courses Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {courses.map((course, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center">
              <span className="text-5xl mb-4 text-indigo-600">{course.icon}</span>
              <h3 className="text-xl font-semibold mb-2 text-center">{course.title}</h3>
              <p className="text-center">{course.desc}</p>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
};
