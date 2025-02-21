import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { DiJava, DiReact } from "react-icons/di";
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si";

const iconMap = {
  Python: <SiPython size={50} color="#306998" />,
  Java: <DiJava size={50} color="#007396" />,
  "C++": <SiCplusplus size={50} color="#00599C" />,
  MySQL: <SiMysql size={50} color="#4479A1" />,
  MongoDB: <SiMongodb size={50} color="#47A248" />,
  Rust: <SiRust size={50} color="#DEA584" />,
  React: <DiReact size={50} color="#61DAFB" />,
};

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/course/getCourses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight py-5">
            Available Courses
          </h2>
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
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {loading ? (
            // Skeleton Loader
            [...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg animate-pulse flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-gray-300 rounded-full mb-4"></div>
                <div className="w-2/3 h-6 bg-gray-300 rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.map((course, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center cursor-pointer"
                onClick={() => navigate(`/course/${course.id}/modules`)}
              >
                <span className="text-5xl mb-4 text-indigo-600">
                  {iconMap[course.name] || <SiPython size={50} color="#306998" />}
                </span>
                <h3 className="text-xl font-semibold mb-2 text-center">{course.name}</h3>
                <p className="text-center">{course.description}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No courses available at the moment.</p>
          )}
        </section>
      </main>
    </div>
  );
};
