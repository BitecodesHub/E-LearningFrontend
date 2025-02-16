// AdminPanel.js
import { Route, Routes } from 'react-router-dom';// Import Sidebar component
import { Navbar} from './Navbar'; // Assuming these are already available
import ModuleList from './ModuleList';  // Import ModuleList and other components
import AddModule from './AddModule';
import {AddCourse} from './AddCourse';
import ModuleDetail from './ModuleDetail';
import Sidebar from './AdminSlidebar';
import { AdminCoursePanel } from './AdminCoursesPanel';

const AdminPanel = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/course/:courseId/modules" element={<ModuleList />} />
            <Route path="/course/:courseId/module/:moduleNumber" element={<ModuleDetail />} />
            <Route path="/course/:courseId/add-module" element={<AddModule />} />
            <Route path="/addcourse" element={<AddCourse />} />
            <Route path="/admincourses" element={<AdminCoursePanel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
