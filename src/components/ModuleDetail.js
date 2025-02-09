import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const ModuleDetail = () => {
  const { courseId, moduleNumber } = useParams();
  const [module, setModule] = useState(null);

  const apiUrl = process.env.REACT_APP_ENV === 'production'
  ? process.env.REACT_APP_LIVE_API
  : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Fetch module details using courseId and moduleNumber
        const response = await axios.get(`${apiUrl}/module/course/${courseId}/module/${moduleNumber}`);
        setModule(response.data);
      } catch (error) {
        console.error("Error fetching module:", error);
      }
    };

    fetchModuleData(); // Call the function to fetch the module data
  }, [courseId, moduleNumber, apiUrl]); // Include apiUrl as a dependency

  if (!module) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
        <Navbar/>
      <h2 className="text-2xl font-bold">Module {module.moduleNumber}: {module.moduleTitle}</h2>
      <p className="text-gray-600">Last Updated: {module.lastUpdated}</p>
      <h3 className="text-lg font-semibold mt-4">Content:</h3>
      <ul className="list-disc ml-6">
        {module.content.map((item, index) => <li key={index}>{item}</li>)}
      </ul>
      <Footer/>
    </div>
  );
};

export default ModuleDetail;
