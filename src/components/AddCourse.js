import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export const AddCourse = ({ closeModal, refreshCourses }) => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;
  const { userToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("thumbnailUrl", image);

    try {
      const response = await axios.post(`${apiUrl}/upload/profilephoto`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        const imageUrl = response.data;

        const courseData = {
          name: courseName,
          description: description,
          duration: duration,
          thumbnailUrl: imageUrl,
        };

        const courseResponse = await axios.post(`${apiUrl}/course/add`, courseData, {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (courseResponse.status === 200) {
          setSuccess(true);
          refreshCourses();
          setTimeout(() => {
            setSuccess(false);
            closeModal();
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed top-5 right-5 bg-green-500 text-white p-3 rounded-lg flex items-center shadow-lg"
        >
          <CheckCircle className="mr-2" size={20} />
          Course added successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Course Name:</label>
          <input
            type="text"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <textarea
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Duration (in hours):</label>
          <input
            type="number"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image:</label>
          <input type="file" className="mt-1 block w-full" onChange={handleFileChange} required />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Adding Course..." : "Add Course"}
        </button>
      </form>
    </div>
  );
};
