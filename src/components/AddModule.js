import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./Navbar";
import Sidebar from "./AdminSlidebar";
import { motion } from "framer-motion";

const AddModule = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [content, setContent] = useState([{ text: "", imageUrl: "" }]);
  const [showSuccess, setShowSuccess] = useState(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    axios
      .get(`${apiUrl}/course/getCourses`)
      .then((response) => setCourses(response.data))
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);

  const handleContentChange = (e, index) => {
    setContent((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text: e.target.value } : item))
    );
  };

  const handleImageChange = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("thumbnailUrl", file);

    try {
      const { data } = await axios.post(`${apiUrl}/upload/profilephoto`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setContent((prev) =>
        prev.map((item, i) => (i === index ? { ...item, imageUrl: data.imageUrl || data } : item))
      );
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course");
      return;
    }

    try {
      await axios.post(`${apiUrl}/module/add/${selectedCourse}`, {
        moduleTitle,
        content: content.map((item) => item.text),
        imageUrls: content.map((item) => item.imageUrl || ""),
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setModuleTitle("");
      setContent([{ text: "", imageUrl: "" }]);
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add Module</h2>
            <form onSubmit={handleAddModule} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Course</label>
                <select
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  required
                >
                  <option value="">-- Select Course --</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Module Title</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border rounded-md"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
                />
              </div>
              {content.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Content {index + 1}
                    </label>
                    <input
                      type="text"
                      className="mt-1 w-full px-4 py-2 border rounded-md"
                      value={item.text}
                      onChange={(e) => handleContentChange(e, index)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                      type="file"
                      className="mt-1 w-full file:px-4 file:py-2 file:border file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={`Uploaded ${index + 1}`}
                        className="mt-2 w-full h-40 object-cover rounded-md shadow"
                      />
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md"
                onClick={() => setContent([...content, { text: "", imageUrl: "" }])}
              >
                Add More Content
              </button>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg">
                Add Module
              </button>
            </form>
          </div>
        </div>
      </div>
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-10 right-10 bg-green-500 text-white p-4 rounded-lg shadow-lg"
        >
          ✅ Module added successfully!
        </motion.div>
      )}
    </div>
  );
};

export default AddModule;
