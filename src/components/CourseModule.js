import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const CourseModule = () => {
  const { courseId } = useParams(); // Get course ID from URL params
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const hasFetched = useRef(false); // Prevent duplicate API calls

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true;

    fetch(`${apiUrl}/module/course/${courseId}`)
      .then((response) => response.json())
      .then((data) => {
        setModules(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching modules:", error);
        setLoading(false);
      });
  }, [courseId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/course/${courseId}/module/${moduleId}`);
  };

  const handleTakeExam = () => {
    navigate(`/course/${courseId}/exam`);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <div className="flex-grow w-full bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Course Modules
          </h1>
          <p className="text-gray-600 text-lg">
            Master your skills with our comprehensive learning modules
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div
                key={module[0]}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => handleModuleClick(module[0])}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-semibold text-blue-600">
                    {index + 1}.
                  </span>
                  <span className="text-2xl font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-300">
                    {module[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No modules available.</p>
        )}

        <div className="mt-10 flex justify-center">
          <button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            onClick={handleTakeExam}
          >
            Take Exam
          </button>
        </div>
      </div>
    </div>
  );
};
