import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CourseModuleDetail = () => {
  const { courseId, moduleNumber } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalModules, setTotalModules] = useState(0);
  const hasFetched = useRef(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on module change
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
  }, [courseId, moduleNumber]);

  const handleNavigation = (direction) => {
    const newModuleNumber =
      direction === "next"
        ? parseInt(moduleNumber) + 1
        : parseInt(moduleNumber) - 1;

    navigate(`/course/${courseId}/module/${newModuleNumber}`);
    hasFetched.current = false; // Allow refetching on navigation
  };

  const handleTakeExam = () => {
    navigate(`/course/${courseId}/exam`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-8 group"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <ArrowLeft className="w-6 h-6 mr-2 transition-transform group-hover:-translate-x-1" />
          <span className="font-medium text-xl">Back to Modules</span>
        </motion.button>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="h-12 bg-gray-200 animate-pulse rounded-xl w-3/4 mx-auto" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 sm:p-12 border border-white/20"
            >
              <motion.h2
                variants={itemVariants}
                className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent text-center mb-12"
              >
                Module {module.moduleNumber}<span className="text-gray-400 mx-3">|</span>
                <span className="font-extrabold">{module.moduleTitle}</span>
              </motion.h2>

              <div className="space-y-16">
                {module.imageUrls?.map((url, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="relative"
                  >
                    <img
                      src={url}
                      alt={`Module Image ${index + 1}`}
                      className="w-4/5 mx-auto rounded-2xl shadow-lg border-8 border-white/10"
                    />
                    {module.content[index] && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl text-gray-600 mt-6 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0"
                      >
                        {module.content[index]}
                      </motion.p>
                    )}
                  </motion.div>
                ))}

                {!module.imageUrls?.length && (
                  <motion.ul
                    variants={containerVariants}
                    className="space-y-6 max-w-3xl mx-auto"
                  >
                    {module.content?.map((item, index) => (
                      <motion.li
                        key={index}
                        variants={itemVariants}
                        className="p-6 bg-indigo-50/50 rounded-xl border border-indigo-100/50"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white">
                              {index + 1}
                            </div>
                          </div>
                          <p className="ml-4 text-gray-700 text-xl leading-relaxed">
                            {item}
                          </p>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>

              <motion.div
                variants={itemVariants}
                className="mt-16 flex flex-col sm:flex-row justify-center gap-6"
              >
                {parseInt(moduleNumber) > 1 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation("prev")}
                    className="flex items-center bg-white text-indigo-600 px-6 py-3 rounded-xl shadow-lg border-2 border-indigo-100 text-xl"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Previous Module
                  </motion.button>
                )}

                {parseInt(moduleNumber) < totalModules ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation("next")}
                    className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-lg text-xl"
                  >
                    Next Module
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTakeExam}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl shadow-lg text-xl font-semibold"
                  >
                    🚀 Take Final Exam
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CourseModuleDetail;