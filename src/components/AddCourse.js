import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState(null);

  const { userToken, isAuthenticated, logout, userName } = useAuth();  // Assuming you store the token in your context
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
      const response = await axios.post("https://www.elearningbackend.bitecodes.com/upload", formData, {
        
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
        const courseResponse = await axios.post("http://localhost:8080/course/add", courseData, {
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
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
           {/* Navbar */}
            <Navbar/>

      {/* Add Course Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
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
      
      <Footer/>
    </div>
  );
};
