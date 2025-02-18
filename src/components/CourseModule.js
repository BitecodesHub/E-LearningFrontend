import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const CourseModule = () => {
  const { courseId } = useParams(); // Get course ID from URL params
  const [modules, setModules] = useState([]);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_ENV === "production"
  ? process.env.REACT_APP_LIVE_API
  : process.env.REACT_APP_LOCAL_API;


  useEffect(() => {
    fetch(`${apiUrl}/module/course/${courseId}`)
      .then((response) => response.json())
      .then((data) => setModules(data))
      .catch((error) => console.error("Error fetching modules:", error));
  }, [courseId]);

  const handleModuleClick = (moduleId) => {
    navigate(`/course/${courseId}/module/${moduleId}`); // Dynamic course ID
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex flex-col">
      <Navbar />

      <div className="flex-grow w-full bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-xl p-10">
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Course Modules
          </h1>
          <p className="text-gray-600 text-lg">
            Master your skills with our comprehensive learning modules
          </p>
        </header>

        {modules.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module, index) => (
              <div
                key={module[0]}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
                onClick={() => handleModuleClick(module[0])}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-semibold text-blue-600">{index + 1}.</span>
                  <span className="text-2xl font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-300">
                    {module[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Loading modules...</p>
        )}
      </div>

      <Footer />
    </div>
  );
};
