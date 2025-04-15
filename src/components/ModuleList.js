import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./AdminSlidebar";
import { motion } from "framer-motion";

const ModuleList = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/course/getCourses`);
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [apiUrl]);

  // Fetch modules when course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchModules(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchModules = async (courseId) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiUrl}/module/course/${courseId}`);
      setModules(data);
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Course Modules</h2>

            {/* Course Selection Dropdown */}
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="mb-4 p-2 w-full border rounded-md"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>

            {/* Modules List */}
            {loading ? (
              <p className="text-gray-500">Loading modules...</p>
            ) : modules.length > 0 ? (
              <ul className="space-y-4">
                {modules.map((mod) => (
                  <motion.li
                    key={mod[0]}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-all"
                  >
                    <Link
                      to={`/course/${selectedCourse}/module/${mod[0]}`}
                      className="text-lg text-blue-600 font-semibold hover:underline"
                    >
                      Module {mod[0]}: {mod[1]}
                    </Link>
                    <p className="text-gray-600 text-sm">Last Updated: {mod[2]}</p>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No modules available for this course.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
