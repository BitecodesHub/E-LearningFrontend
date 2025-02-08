import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { DiJava, DiReact } from "react-icons/di"; // Java & React icons
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si"; 
import { BiSearch } from "react-icons/bi";

export const Courses = () => {
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

{/* Courses Section */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl  font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight py-5">Available Courses</h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Explore our comprehensive collection of programming courses
          </p>
          <div className="flex items-center justify-center space-x-4">
          <div className="relative w-64">
      <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
      <input
        type="text"
        placeholder="Search Courses"
        className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 w-full"
      />
    </div>
        <details className="relative">
      <summary className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-600">
        <span>Search</span>
      </summary>
    </details>

          </div>
        </header>

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