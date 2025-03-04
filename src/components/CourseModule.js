import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const CourseModule = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState("");
  const [error, setError] = useState(null);
  const [visitedModules, setVisitedModules] = useState([]);
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    // Simulate fetching course title (you can replace with actual API call)
    const fakeCourseNames = {
      "1": "Web Development Masterclass",
      "2": "Data Science Fundamentals",
      "3": "UX/UI Design Principles"
    };
    setCourseTitle(fakeCourseNames[courseId] || "Course Content");

    // Load visited modules from localStorage
    const storedVisitedModules = localStorage.getItem(`visitedModules_${courseId}`);
    if (storedVisitedModules) {
      setVisitedModules(JSON.parse(storedVisitedModules));
    }

    // Fetch modules
    fetch(`${apiUrl}/module/course/${courseId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch modules");
        }
        return response.json();
      })
      .then((data) => {
        setModules(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
        setError("We couldn't load your modules. Please try again later.");
        setLoading(false);
      });
  }, [courseId, apiUrl]);

  const handleModuleClick = (moduleId) => {
    // Mark module as visited
    if (!visitedModules.includes(moduleId)) {
      const updatedVisitedModules = [...visitedModules, moduleId];
      setVisitedModules(updatedVisitedModules);
      
      // Store visited modules in localStorage
      localStorage.setItem(`visitedModules_${courseId}`, JSON.stringify(updatedVisitedModules));
    }
    
    navigate(`/course/${courseId}/module/${moduleId}`);
  };

  const handleTakeExam = () => {
    navigate(`/course/${courseId}/exam`);
  };

  const handleBackToCourses = () => {
    navigate("/courses");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const renderModuleIcon = (index) => {
    const icons = ["📚", "🧩", "📊", "💡", "🔍", "🛠️", "📝", "🧠", "🎯", "📱"];
    return icons[index % icons.length];
  };

  const getProgressPercentage = () => {
    if (modules.length === 0) return 0;
    return Math.floor((visitedModules.length / modules.length) * 100);
  };

  const isModuleVisited = (moduleId) => {
    return visitedModules.includes(moduleId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        {/* Course header card */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="h-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600"></div>
          <div className="p-6 md:p-8 -mt-10">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {courseTitle}
                </h1>
                <p className="text-gray-600 mt-2">
                  {modules.length} modules • Estimated completion: {modules.length * 2} hours
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={handleBackToCourses}
                  className="text-indigo-600 hover:text-indigo-800 mr-4 transition"
                >
                  ← Back to Courses
                </button>
              </div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-indigo-800 mb-1">Course Progress</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-indigo-700 mt-1">
                  {visitedModules.length} of {modules.length} modules completed ({getProgressPercentage()}%)
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTakeExam}
                className="ml-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition duration-300 flex items-center"
              >
                <span className="mr-2">Take Exam</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="w-full bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <header className="mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Module Content
            </h2>
            <p className="text-gray-600 mt-1">
              Select a module to continue your learning journey
            </p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              ></motion.div>
              <p className="mt-4 text-indigo-600 font-medium">Loading your modules...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-8 bg-red-50 rounded-xl"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800">{error}</p>
              <button
                onClick={() => { hasFetched.current = false; setLoading(true); setError(null); }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
              >
                Try Again
              </button>
            </motion.div>
          ) : modules.length > 0 ? (
            <AnimatePresence>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {modules.map((module, index) => (
                  <motion.div
                    key={module[0]}
                    variants={itemVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(99, 102, 241, 0.2)" }}
                    className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div 
                      className={`h-2 ${
                        index % 3 === 0 ? "bg-indigo-500" : 
                        index % 3 === 1 ? "bg-purple-500" : "bg-blue-500"
                      }`}
                    ></div>
                    <button
                      onClick={() => handleModuleClick(module[0])}
                      className="w-full p-5 text-left"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                            index % 3 === 0 ? "bg-indigo-100 text-indigo-600" : 
                            index % 3 === 1 ? "bg-purple-100 text-purple-600" : 
                            "bg-blue-100 text-blue-600"
                          }`}>
                          <span className="text-2xl">{renderModuleIcon(index)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-semibold text-gray-500 mr-2">
                              Module {index + 1}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                            <span className="text-xs text-gray-500 ml-2">
                              {Math.floor(Math.random() * 30) + 15} min
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            {module[1]}
                          </h3>
                          {isModuleVisited(module[0]) && (
                            <div className="flex items-center mt-2 text-green-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-xs font-medium">Completed</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-gray-600">No modules available for this course</p>
              <button
                onClick={handleBackToCourses}
                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
              >
                Browse Other Courses
              </button>
            </motion.div>
          )}

          {!loading && !error && modules.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 bg-indigo-50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between border border-indigo-100"
            >
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-indigo-900">Ready for assessment?</h3>
                <p className="text-indigo-700">Complete all modules and test your knowledge</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTakeExam}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-xl transition duration-300 flex items-center"
              >
                <span className="mr-2">Take Final Exam</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Need help with your course? Contact our support team</p>
        </motion.div>
      </motion.div>
    </div>
  );
};