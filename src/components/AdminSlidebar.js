import {React} from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {

  return (
    <div
      className="w-64 bg-blue-900 text-white"
      style={{ minHeight: '100vh' }}
    >
      <div className="p-6">
        <h2 className="text-3xl font-bold">Admin Panel</h2>
      </div>
      <nav>
        <ul className="space-y-4 p-4">
          <li>
            <Link
              to="/admincourses"
              className="block text-lg hover:bg-blue-700 p-3 rounded-md"
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to={`/course/modules`}
              className="block text-lg hover:bg-blue-700 p-3 rounded-md"
            >
              Modules List
            </Link>
          </li>
          <li>
            <Link
              to={`/course/add-module`}
              className="block text-lg hover:bg-blue-700 p-3 rounded-md"
            >
              Add Module
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
