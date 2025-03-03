import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SiPython, SiMysql, SiMongodb, SiRust, SiCplusplus } from "react-icons/si";
import { DiJava, DiReact } from "react-icons/di";
import { FaRobot, FaArrowRight, FaStar } from "react-icons/fa";

export const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
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

  // Enhanced CourseCard component with animated blue running light
  const CourseCard = ({ course, index }) => {
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        {/* Hero Section */}
        <section className="text-center mb-20 relative">
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-full max-w-md h-16 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-3xl rounded-full"></div>
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight py-5 animate-pulse-slow">
            Master Programming Today
          </h2>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-indigo-900 opacity-80">
            Learn programming at your own pace with expert-led courses, hands-on projects, and AI-powered assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-indigo-200 flex items-center justify-center">
              <a href="/courses" className="flex items-center">
                Explore Courses
                <FaArrowRight className="ml-2" />
              </a>
            </button>
            <button className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-200 flex items-center justify-center">
              <a href="/ai" className="flex items-center">
                Try AI Assistant
                <FaRobot className="ml-2" />
              </a>
            </button>
          </div>
        </section>

        {/* Courses Section with Blue Running Light Animation */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">Popular Courses</h3>
            <button 
              className="text-purple-600 hover:text-purple-800 flex items-center group"
              onClick={() => navigate('/courses')}
            >
              <span className="group-hover:mr-2 transition-all">View All</span>
              <FaArrowRight className="ml-1 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
              courses.map((course, index) => (
                <CourseCard key={index} course={course} index={index} />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-3">No courses available at the moment.</p>
            )}
          </div>
        </section>

        {/* Enhanced AI Section */}
        <section className="mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-5 rounded-3xl blur-md"></div>
          <div className="bg-white rounded-2xl shadow-lg p-8 overflow-hidden relative">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-indigo-100 rounded-full opacity-20"></div>
            <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-100 rounded-full opacity-20"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Powered Learning</h3>
                <p className="mb-4 text-gray-700">
                  Supercharge your learning with our new AI assistant. Get personalized help, code reviews,
                  and instant answers to your programming questions.
                </p>
                <ul className="mb-6 space-y-3">
                  <li className="flex items-center bg-indigo-50 p-2 rounded-lg">
                    <span className="text-green-500 mr-2 bg-white p-1 rounded-full">✓</span> 
                    <span className="text-indigo-800">Personalized learning recommendations</span>
                  </li>
                  <li className="flex items-center bg-indigo-50 p-2 rounded-lg">
                    <span className="text-green-500 mr-2 bg-white p-1 rounded-full">✓</span> 
                    <span className="text-indigo-800">Real-time code analysis</span>
                  </li>
                  <li className="flex items-center bg-indigo-50 p-2 rounded-lg">
                    <span className="text-green-500 mr-2 bg-white p-1 rounded-full">✓</span> 
                    <span className="text-indigo-800">24/7 programming assistance</span>
                  </li>
                </ul>
                <button 
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-1 group"
                  onClick={() => navigate('/ai')}
                >
                  <span className="group-hover:mr-2 transition-all">Learn More</span>
                  <FaArrowRight className="inline ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
                  <div className="relative z-10">
                    <FaRobot className="text-6xl text-indigo-600 group-hover:text-indigo-700 transition-all duration-300 transform group-hover:scale-110" />
                  </div>
                  {/* AI glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 blur opacity-20 group-hover:opacity-40 animate-spin-slow"></div>
                </div>
              </div>
            </div>
          </div>
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
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </div>
  );
};