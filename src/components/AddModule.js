import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import Sidebar from "./AdminSlidebar";

const AddModule = () => {
  const { courseId } = useParams();
  const [moduleTitle, setModuleTitle] = useState("");
  const [content, setContent] = useState([{ text: "", image: null }]);

  const apiUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_LIVE_API
    : process.env.REACT_APP_LOCAL_API;

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setContent((prev) =>
        prev.map((item, i) => (i === index ? { ...item, image: file } : item))
      );
    }
  };

  const handleContentChange = (e, index) => {
    setContent((prev) =>
      prev.map((item, i) => (i === index ? { ...item, text: e.target.value } : item))
    );
  };

  const handleAddModule = async (e) => {
    e.preventDefault();

    const updatedContent = await Promise.all(
      content.map(async (item) => {
        if (!item.image) return item;

        const formData = new FormData();
        formData.append("thumbnailUrl", item.image);

        try {
          const { data } = await axios.post(`${apiUrl}/upload/profilephoto`, formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });
          return { ...item, imageUrl: data };
        } catch (error) {
          console.error("Error uploading image:", error);
          return { ...item, imageUrl: null };
        }
      })
    );

    try {
      await axios.post(`${apiUrl}/module/add/${courseId}`, {
        moduleTitle,
        content: updatedContent.map(({ text, imageUrl }) => ({ text, imageUrl })),
      });
      alert("Module added successfully!");
    } catch (error) {
      console.error("Error adding module:", error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">Add Module to Course {courseId}</h2>

            <form onSubmit={handleAddModule} className="space-y-6">
              {/* Module Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Module Title</label>
                <input
                  type="text"
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:outline-none"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
                />
              </div>

              {/* Dynamic Content Fields */}
              {content.map((item, index) => (
                <div key={index} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Content {index + 1}</label>
                    <input
                      type="text"
                      className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:outline-none"
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
                  </div>
                </div>
              ))}

              {/* Add More Content Button */}
              <button
                type="button"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={() => setContent([...content, { text: "", image: null }])}
              >
                Add More Content
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all hover:-translate-y-1 mt-4"
              >
                Add Module
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddModule;
