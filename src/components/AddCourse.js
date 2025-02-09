import React, { useState ,useEffect} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import Sidebar from "./AdminSlidebar";

export const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);
  const apiUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_LIVE_API
    : process.env.REACT_APP_LOCAL_API;
  const { userToken, isAuthenticated, logout, userName } = useAuth(); // Assuming you store the token in your context
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Upload the image first
    if (!image) {
      alert("Please select an image.");
      return;
    }

    // Prepare form data for image upload
    const formData = new FormData();
    formData.append("thumbnailUrl", image);

    try {
      // Upload the image to the backend
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${userToken}`,  // Include JWT token in the header
        },
      });

      if (response.status === 200) {
        // Step 2: Once the image is uploaded successfully, send the course data with the image URL
        const imageUrl = response.data; // Assuming response contains the image URL or path

        const courseData = {
          name: courseName,
          description: description,
          duration: duration,
          thumbnailUrl: imageUrl,
        };

        // Send the course data to the server
        const courseResponse = await axios.post(`${apiUrl}/course/add`, courseData, {
          headers: {
            "Authorization": `Bearer ${userToken}`,  // Include JWT token in the header
          },
        });

        if (courseResponse.status === 200) {
          alert("Course added successfully!");
        } else {
          alert("Failed to add course.");
        }
      } else {
        alert("Failed to upload image.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLoginSignup = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="w-full bg-white shadow-md">
          <Navbar />
        </div>

        {/* Add Course Form */}
        <div className="flex-1 flex justify-center items-center p-6">
          <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-md mt-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                  Course Name:
                </label>
                <input
                  type="text"
                  id="courseName"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description:
                </label>
                <textarea
                  id="description"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                  Duration (in hours):
                </label>
                <input
                  type="number"
                  id="duration"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">
                  Upload Image:
                </label>
                <input
                  type="file"
                  id="thumbnailUrl"
                  className="mt-1 block w-full text-sm text-gray-700 file:border file:rounded-md file:px-4 file:py-2 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all hover:-translate-y-1"
                >
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
