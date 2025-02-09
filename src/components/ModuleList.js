// ModuleList.js
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Navbar, Footer } from "./Navbar";// Import Sidebar component
import Sidebar from "./AdminSlidebar";

const ModuleList = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [courseName, setCourseName] = useState("");

  const apiUrl = process.env.REACT_APP_ENV === 'production'
    ? process.env.REACT_APP_LIVE_API
    : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    // Fetching modules and course name together in one API call if possible
    const fetchData = async () => {
      try {
        // Fetching course name
        const courseResponse = await axios.get(`${apiUrl}/course/getCourseName/${courseId}`);
        setCourseName(courseResponse.data);

        // Fetching modules
        const modulesResponse = await axios.get(`${apiUrl}/module/course/${courseId}`);
        setModules(modulesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Call the fetch function

  }, [courseId, apiUrl]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <Navbar />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Modules for {courseName || "Loading..."}</h2>
          <ul className="space-y-2">
            {modules.map((mod, index) => (
              <li key={index} className="p-4 bg-gray-100 rounded shadow">
                <Link to={`/course/${courseId}/module/${mod[0]}`} className="text-blue-600 font-semibold">
                  Module {mod[0]}: {mod[1]}
                </Link>
                <p className="text-gray-600">Last Updated: {mod[2]}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
