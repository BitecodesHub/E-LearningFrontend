import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const UserAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const userId = 1; // Change this to dynamic user ID
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

      useEffect(() => {
        // Fetch attempts
        fetch(`${apiUrl}/api/attempts/user/${userId}`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched Attempts:", data);
            setAttempts(data);
          })
          .catch((err) => console.error("Error fetching attempts:", err));
    
        // Fetch courses
        fetch(`${apiUrl}/course/getCourses`)
          .then((res) => res.json())
          .then((data) => {
            console.log("Fetched Courses:", data);
            if (Array.isArray(data)) {
              setCourses(data); // ✅ Ensure courses is set as an array
            } else {
              setCourses([]); // ✅ Default to empty array if response is not an array
            }
          })
          .catch((err) => {
            console.error("Error fetching courses:", err);
            setCourses([]); // ✅ Prevent crash if fetch fails
          });
      }, [userId]);
    
    

  // Function to format date properly
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  // Filter attempts based on selected course
  const filteredAttempts =
    selectedCourse === "all"
      ? attempts
      : attempts.filter((attempt) => attempt.courseId === parseInt(selectedCourse));

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <div className="flex-grow max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mt-10 w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Exam Attempts</h1>

        {/* Dropdown for Course Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-2 border rounded-md"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {filteredAttempts.length === 0 ? (
          <p className="text-center text-gray-500">No attempts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border p-3">Attempt ID</th>
                  <th className="border p-3">Course</th>
                  <th className="border p-3">Score</th>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Result</th>
                  <th className="border p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map((attempt) => (
                  <tr key={attempt.id} className="text-left border hover:bg-gray-100">
                    <td className="border p-3">{attempt.id}</td>
                    <td className="border p-3">{getCourseName(attempt.courseId)}</td>
                    <td className="border p-3">{attempt.score}%</td>
                    <td className="border p-3">{formatDate(attempt.attemptedAt)}</td>
                    <td className="border p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-white ${
                          attempt.passed ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {attempt.passed ? "Pass" : "Fail"}
                      </span>
                    </td>
                    <td className="border p-3">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => navigate(`/result/${attempt.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
