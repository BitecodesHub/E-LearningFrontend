import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BiSearch } from "react-icons/bi";
import { DiJava, DiReact } from "react-icons/di";
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si";
import { FaArrowRight, FaStar } from "react-icons/fa";

export const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  const courseIcons = {
    python: <SiPython size={50} color="#306998" />,
    java: <DiJava size={50} color="#007396" />,
    "c++": <SiCplusplus size={50} color="#00599C" />,
    mysql: <SiMysql size={50} color="#4479A1" />,
    mongodb: <SiMongodb size={50} color="#47A248" />,
    rust: <SiRust size={50} color="#DEA584" />,
    react: <DiReact size={50} color="#61DAFB" />,
  };

  // Enhanced CourseCard component with animated blue running light
  const CourseCard = ({ course }) => {
    const normalizedName = course.name.trim().toLowerCase();
    
    return (
      <div className="course-card-container">
        <div 
          className="course-card bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center cursor-pointer relative z-10"
          onClick={() => navigate(`/course/${course.id}/modules`)}
        >
          <div className="icon-container p-4 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 mb-4 transition-all duration-300 hover:scale-110">
            <span className="text-5xl text-indigo-600">
              {courseIcons[normalizedName] || <DiReact size={50} color="#61DAFB" />}
            </span>
          </div>
          <h3 className="text-xl font-semibold mb-2 text-center text-indigo-800">{course.name.trim()}</h3>
          <p className="text-center text-gray-600">{course.description}</p>
          
          <div className="mt-4 w-full pt-4 border-t border-gray-100 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-800">
              {Math.floor(Math.random() * 10) + 5} modules
            </span>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xs" />
                ))}
              </div>
              <span className="text-purple-600 transition-transform transform group-hover:translate-x-1">
                <FaArrowRight />
              </span>
            </div>
          </div>
          
          {/* Blue running light animation on edges */}
          <div className="blue-running-light"></div>
        </div>
      </div>
    );
  };

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12 relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md h-16 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-3xl rounded-full"></div>
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight py-5 animate-pulse-slow">
            Available Courses
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-indigo-900 opacity-80">
            Explore our comprehensive collection of programming courses
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="relative w-64">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search Courses"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-indigo-600 w-full shadow-md hover:shadow-lg transition-all duration-200"
              />
            </div>
          </div>
        </header>

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
          ) : filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center p-12 bg-white rounded-2xl shadow-md">
              <div className="text-6xl text-indigo-300 mb-4">😕</div>
              <p className="text-center text-xl font-medium text-indigo-800 mb-2">No courses found</p>
              <p className="text-center text-gray-600">Try adjusting your search term</p>
            </div>
          )}
        </section>
      </main>

      {/* Add the necessary CSS animations */}
      <style jsx>{`
        /* Blue running light animation */
        .course-card-container {
          position: relative;
          border-radius: 1rem;
          overflow: hidden;
        }

        .course-card {
          overflow: hidden;
          z-index: 1;
          background: white;
          height: 100%;
        }

        .course-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(90deg, transparent, #3b82f6, transparent);
          -webkit-mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          -webkit-mask-composite: destination-out;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .course-card:hover::before {
          opacity: 1;
        }

        .blue-running-light {
          position: absolute;
          width: 20px;
          height: 2px;
          background: #3b82f6;
          filter: blur(5px);
          border-radius: 4px;
          opacity: 0;
          top: 0;
          left: -30px;
          box-shadow: 0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6;
          z-index: 5;
        }

        .course-card-container:hover .blue-running-light {
          opacity: 1;
          animation: running-light 2s linear infinite;
        }

        @keyframes running-light {
          0% {
            top: 0;
            left: -30px;
            opacity: 1;
          }
          25% {
            top: 0;
            left: calc(100% + 30px);
            opacity: 1;
          }
          25.1% {
            top: 0;
            left: calc(100% + 30px);
            opacity: 0;
          }
          25.2% {
            top: 0;
            right: -30px;
            left: auto;
            opacity: 0;
          }
          25.3% {
            top: 0;
            right: -30px;
            left: auto;
            opacity: 1;
          }
          50% {
            top: 0;
            right: calc(100% + 30px);
            left: auto;
            opacity: 1;
          }
          50.1% {
            top: 0;
            right: calc(100% + 30px);
            left: auto;
            opacity: 0;
          }
          50.2% {
            top: auto;
            bottom: 0;
            left: -30px;
            opacity: 0;
          }
          50.3% {
            top: auto;
            bottom: 0;
            left: -30px;
            opacity: 1;
          }
          75% {
            top: auto;
            bottom: 0;
            left: calc(100% + 30px);
            opacity: 1;
          }
          75.1% {
            top: auto;
            bottom: 0;
            left: calc(100% + 30px);
            opacity: 0;
          }
          75.2% {
            top: auto;
            bottom: 0;
            right: -30px;
            left: auto;
            opacity: 0;
          }
          75.3% {
            top: auto;
            bottom: 0;
            right: -30px;
            left: auto;
            opacity: 1;
          }
          100% {
            top: auto;
            bottom: 0;
            right: calc(100% + 30px);
            left: auto;
            opacity: 1;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};