import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si";
import { DiJava, DiReact } from "react-icons/di";

export const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Prevents duplicate API calls

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true; // Set flag to true so it doesn't call again
      fetchCourses();
    }
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

  const courseIcons = {
    python: <SiPython size={50} color="#306998" />,
    java: <DiJava size={50} color="#007396" />,
    "c++": <SiCplusplus size={50} color="#00599C" />,
    mysql: <SiMysql size={50} color="#4479A1" />,
    mongodb: <SiMongodb size={50} color="#47A248" />,
    rust: <SiRust size={50} color="#DEA584" />,
    react: <DiReact size={50} color="#61DAFB" />,
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {loading ? (
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
            courses.map((course, index) => {
              // Normalize name: trim spaces and convert to lowercase
              const normalizedName = course.name.trim().toLowerCase();
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}/modules`)}
                >
                  <span className="text-5xl mb-4 text-indigo-600">
                    {courseIcons[normalizedName] || <DiReact size={50} color="#61DAFB" />}
                  </span>
                  <h3 className="text-xl font-semibold mb-2 text-center">{course.name.trim()}</h3>
                  <p className="text-center">{course.description}</p>
                </div>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No courses available at the moment.</p>
          )}
        </section>
      </main>
    </div>
  );
};
