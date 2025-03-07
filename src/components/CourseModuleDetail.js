import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight, Image, X, BookOpen, Award, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CourseModuleDetail = () => {
  const { courseId, moduleNumber } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalModules, setTotalModules] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const hasFetched = useRef(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moduleNumber]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchModuleData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/module/course/${courseId}/module/${moduleNumber}`
        );
        setModule(response.data);

        const totalResponse = await axios.get(
          `${apiUrl}/module/course/${courseId}`
        );
        setTotalModules(totalResponse.data.length);
      } catch (error) {
        console.error("Error fetching module:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleNumber, apiUrl]);

  const handleNavigation = (direction) => {
    setLoading(true);
    const newModuleNumber =
      direction === "next"
        ? parseInt(moduleNumber) + 1
        : parseInt(moduleNumber) - 1;

    navigate(`/course/${courseId}/module/${newModuleNumber}`);
    hasFetched.current = false;
  };

  const handleTakeExam = () => {
    navigate(`/course/${courseId}/exam`);
  };

  const showImage = (index) => {
    setActiveImageIndex(index);
    document.body.style.overflow = "hidden";
  };

  const hideImage = () => {
    setActiveImageIndex(null);
    document.body.style.overflow = "auto";
  };

  // Simplified animation variants
  const pageTransition = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };

  // Get icon for content block
  const getContentIcon = (index) => {
    const icons = ["📚", "🧩", "📊", "💡", "🔍", "🛠️", "📝", "🧠"];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white py-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center hover:text-white hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm sm:text-base font-medium">Back to Course</span>
          </button>
          
          <div className="flex items-center bg-white/20 px-3 py-1 rounded-lg">
            <Clock className="w-4 h-4 mr-1 text-white" />
            <span className="text-sm font-medium">Module {moduleNumber} of {totalModules}</span>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24"
            >
              {/* Simple loader circle without rotation */}
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-8"></div>
              
              <p className="mt-6 text-indigo-700 font-medium text-center">
                Loading module content...
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={pageTransition}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-8"
            >
              {/* Module Title */}
              <div className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {module.moduleTitle}
                </h1>
                <div className="mt-3 inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Module {moduleNumber}</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="max-w-xl mx-auto">
                <div className="h-3 bg-indigo-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${(parseInt(moduleNumber) / totalModules) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-indigo-600">
                  <span>Module 1</span>
                  <span>Module {moduleNumber}/{totalModules}</span>
                  <span>Complete</span>
                </div>
              </div>

              {/* Content */}
              <div className="mt-12 space-y-6">
                {module.imageUrls?.map((url, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-indigo-100"
                  >
                    <div className={`h-2 ${
                      index % 3 === 0 ? "bg-indigo-500" : 
                      index % 3 === 1 ? "bg-purple-500" : "bg-blue-500"
                    }`}></div>
                    <div className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg ${
                          index % 3 === 0 ? "bg-indigo-100 text-indigo-600" : 
                          index % 3 === 1 ? "bg-purple-100 text-purple-600" : 
                          "bg-blue-100 text-blue-600"
                        }`}>
                          <span className="text-2xl">{getContentIcon(index)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">
                            Concept {index + 1}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{Math.floor(Math.random() * 10) + 5} min</span>
                          </div>
                        </div>
                      </div>
                      
                      {module.content[index] && (
                        <p className="text-gray-600 leading-relaxed">
                          {module.content[index]}
                        </p>
                      )}
                      
                      <div className="mt-6">
                        <button
                          onClick={() => showImage(index)}
                          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          View Practical Example
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {!module.imageUrls?.length && (
                  <div className="bg-white rounded-xl shadow-md border border-indigo-100 p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <div className="bg-indigo-100 text-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      Key Concepts
                    </h3>
                    
                    <div className="space-y-4">
                      {module.content?.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex-shrink-0 mr-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                              index % 3 === 0 ? "bg-indigo-600" : 
                              index % 3 === 1 ? "bg-purple-600" : 
                              "bg-blue-600"
                            }`}>
                              {index + 1}
                            </div>
                          </div>
                          <p className="text-gray-700">
                            {item}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 pb-12 mt-12 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
                {parseInt(moduleNumber) > 1 ? (
                  <button
                    onClick={() => handleNavigation("prev")}
                    className="flex items-center px-5 py-3 bg-white text-indigo-700 rounded-lg shadow-sm hover:shadow-md transition-all mb-4 sm:mb-0"
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Previous Module</span>
                  </button>
                ) : (
                  <div />
                )}

                {parseInt(moduleNumber) < totalModules ? (
                  <button
                    onClick={() => handleNavigation("next")}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    <span className="flex items-center">
                      Continue to Next Module
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handleTakeExam}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
                  >
                    <Award className="w-5 h-5 mr-2" />
                    Take Final Exam
                  </button>
                )}
              </div>
              
              {/* Footer */}
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Need help with this module? Contact our support team</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Improved Image Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && module?.imageUrls?.[activeImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4"
            onClick={hideImage}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header above image */}
              <div className="bg-white rounded-t-xl p-4 flex justify-between items-center">
                <h3 className="text-gray-800 font-medium">Practical Example {activeImageIndex + 1}</h3>
                <button
                  onClick={hideImage}
                  className="text-gray-600 hover:text-gray-800 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Image */}
              <div className="bg-white p-2 pb-6 rounded-b-xl">
                <img
                  src={module.imageUrls[activeImageIndex]}
                  alt={`Practical demonstration ${activeImageIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseModuleDetail;