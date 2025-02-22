import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

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
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchModuleData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/module/course/${courseId}/module/${moduleNumber}`
        );
        setModule(response.data);

        // Fetch total number of modules
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-4xl mx-auto w-full bg-white p-5 sm:p-8 rounded-2xl shadow-md sm:shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-all text-sm sm:text-base"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 mr-2" /> Back to Modules
        </button>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 leading-tight">
              Module {module.moduleNumber}: {module.moduleTitle}
            </h2>

            {/* Display Image & Content */}
            {module.imageUrls?.length > 0 ? (
              module.imageUrls.map((url, index) => (
                <div key={index} className="mt-6 flex flex-col items-center">
                  <img
                    src={url}
                    alt={`Module Image ${index + 1}`}
                    className="w-full max-w-lg sm:max-w-3xl rounded-lg shadow-lg"
                  />
                  {module.content[index] && (
                    <p className="text-base sm:text-lg mt-4 text-gray-700 px-3 sm:px-0">
                      {module.content[index]}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                  📖 Content:
                </h3>
                <ul className="list-disc text-gray-700 mt-2 space-y-2 text-left mx-auto max-w-lg sm:max-w-2xl px-4 sm:px-0">
                  {module.content?.map((item, index) => (
                    <li key={index} className="hover:text-blue-600 text-sm sm:text-base">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Navigation & Exam Button */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4">
              {parseInt(moduleNumber) > 1 && (
                <button
                  onClick={() => handleNavigation("prev")}
                  className="flex items-center bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Previous
                </button>
              )}

              {parseInt(moduleNumber) < totalModules ? (
                <button
                  onClick={() => handleNavigation("next")}
                  className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-all shadow-sm"
                >
                  Next
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleTakeExam}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg transition-all shadow-md text-lg"
                >
                  🎯 Take Exam
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseModuleDetail;
