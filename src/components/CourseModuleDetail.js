import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import { ArrowLeft } from "lucide-react"; // Import back arrow icon

const CourseModuleDetail = () => {
  const { courseId, moduleNumber } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        const response = await axios.get(
          `${apiUrl}/module/course/${courseId}/module/${moduleNumber}`
        );
        setModule(response.data);
      } catch (error) {
        console.error("Error fetching module:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModuleData();
  }, [courseId, moduleNumber, apiUrl]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white to-gray-50">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transform transition-all duration-500 ease-in-out">
            
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              <ArrowLeft className="w-6 h-6 mr-2" /> Back to Modules
            </button>

            {/* Loading Spinner */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                  Module {module.moduleNumber}: {module.moduleTitle}
                </h2>

                {/* Display images with their respective content if images exist */}
                {module.imageUrls?.length > 0 ? (
                  module.imageUrls.map((url, index) => (
                    <div key={index} className="mt-8 space-y-6">
                      <div className="flex flex-col items-center">
                        <img
                          src={url}
                          alt={`Module Image ${index + 1}`}
                          className="w-full max-w-4xl rounded-xl shadow-lg hover:scale-105 transition-all duration-300 ease-in-out"
                        />
                        {module.content[index] && (
                          <p className="text-lg mt-4 text-gray-700 text-left w-full">
                            {module.content[index]}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  /* If no images, just display the content */
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800">
                      📖 Content:
                    </h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-2">
                      {module.content?.map((item, index) => (
                        <li
                          key={index}
                          className="transition-all duration-300 ease-in-out hover:text-blue-600"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseModuleDetail;
