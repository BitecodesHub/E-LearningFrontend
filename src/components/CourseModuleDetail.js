import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const CourseModuleDetail = () => {
  const { courseId, moduleNumber } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Prevent double-fetching

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate API call
    hasFetched.current = true;

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
  }, [courseId, moduleNumber]);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-white to-gray-50">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 ms-3"
          >
            <ArrowLeft className="w-6 h-6 mr-2" /> Back to Modules
          </button>
          <div className="max-w-4xl mb-3 mx-auto bg-white p-8 rounded-3xl shadow-xl">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-indigo-700 mb-4">
                  Module {module.moduleNumber}: {module.moduleTitle}
                </h2>
                {module.imageUrls?.length > 0 ? (
                  module.imageUrls.map((url, index) => (
                    <div key={index} className="mt-8 space-y-6">
                      <div className="flex flex-col items-center">
                        <img
                          src={url}
                          alt={`Module Image ${index + 1}`}
                          className="w-full max-w-4xl rounded-xl shadow-lg"
                        />
                        {module.content[index] && (
                          <p className="text-lg mt-4 text-gray-700">{module.content[index]}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-800">📖 Content:</h3>
                    <ul className="list-disc ml-6 text-gray-700 space-y-2">
                      {module.content?.map((item, index) => (
                        <li key={index} className="hover:text-blue-600">{item}</li>
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
