import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Sidebar from "./AdminSlidebar";
import { AddCourse } from "./AddCourse";
import { X, Trash2 } from "lucide-react";

export const AdminCoursePanel = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${apiUrl}/course/getCourses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourseId) return;
    try {
      await axios.delete(`${apiUrl}/course/deletecourse/${selectedCourseId}`);
      setCourses(courses.filter((course) => course.id !== selectedCourseId));
      setIsConfirmOpen(false);
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="p-6">
          <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
            Admin Course Panel
          </h1>

          <div className="flex justify-end mb-6">
            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-lg shadow-md"
            >
              + Add Course
            </motion.button>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transform transition duration-500 hover:shadow-xl relative"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={course.thumbnailUrl || "/default-thumbnail.png"}
                  alt={course.name}
                  className="w-full h-52 object-cover bg-gray-200"
                  onError={(e) => (e.target.src = "/default-thumbnail.png")}
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 truncate">{course.name}</h2>
                  <p className="text-gray-600 mt-2 line-clamp-2">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-600">
                      ⏳ {course.duration} hrs
                    </span>
                    <span className="text-sm font-semibold text-yellow-500">
                      ⭐ {course.rating || "N/A"}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setIsConfirmOpen(true);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Add Course</h2>
            <AddCourse closeModal={() => setIsModalOpen(false)} refreshCourses={fetchCourses} />
          </motion.div>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm relative"
          >
            <h2 className="text-lg font-semibold mb-4">Are you sure you want to delete this course?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCourse}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};