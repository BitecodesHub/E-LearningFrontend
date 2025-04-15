import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./AdminSlidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Edit, Trash2, Save, X, User } from "lucide-react";

const AdminUserPanel = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", role: "", enabled: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${apiUrl}/api/auth/getallusers`);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [apiUrl]);

  // Handle search
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  // Handle edit
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name || "", role: user.role || "", enabled: user.enabled });
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`${apiUrl}/api/auth/updateuser/${id}`, editForm);
      setUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...editForm } : user
        )
      );
      setFilteredUsers((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, ...editForm } : user
        )
      );
      setEditingUser(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${apiUrl}/api/auth/deleteuser/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      setFilteredUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto w-full"
        >
          {/* Header */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 mb-6 sm:mb-8">
            Manage Users
          </h2>

          {/* Main Content */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 ring-1 ring-gray-200/50 dark:ring-gray-700/50">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <motion.input
                  type="text"
                  placeholder="Search by username or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-10 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all duration-300 shadow-glow hover:shadow-glow-hover"
                  whileHover={{ scale: 1.02 }}
                  whileFocus={{ scale: 1.02 }}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
              </div>
            </div>

            {/* Users List */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"
                ></motion.div>
                <p className="mt-4 text-blue-600 dark:text-blue-400 font-medium">
                  Loading users...
                </p>
              </div>
            ) : error ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 bg-red-50/50 dark:bg-red-900/20 rounded-xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-800 dark:text-red-300">{error}</p>
                <motion.button
                  onClick={() => {
                    setError(null);
                    setLoading(true);
                    setUsers([]);
                    setFilteredUsers([]);
                  }}
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-glow-red hover:shadow-glow-red-hover transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              </motion.div>
            ) : filteredUsers.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-glow transition-all duration-300 overflow-hidden relative"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div
                      className={`h-2 ${
                        index % 3 === 0
                          ? "bg-blue-500 dark:bg-blue-600"
                          : index % 3 === 1
                          ? "bg-purple-500 dark:bg-purple-600"
                          : "bg-indigo-500 dark:bg-indigo-600"
                      }`}
                    ></div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-4 mb-4">
                        {user.profileurl ? (
                          <img
                            src={user.profileurl}
                            alt={user.name || user.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User size={24} className="text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                            {user.name || user.username || "Unnamed User"}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      {editingUser === user.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            placeholder="Name"
                            className="w-full px-3 py-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          />
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="w-full px-3 py-2 bg-white/90 dark:bg-gray-800/90 border border-gray-200/50 dark:border-gray-700/50 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                          >
                            <option value="">Select Role</option>
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                            <input
                              type="checkbox"
                              checked={editForm.enabled}
                              onChange={(e) => setEditForm({ ...editForm, enabled: e.target.checked })}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-400 border-gray-300 rounded"
                            />
                            Enabled
                          </label>
                          <div className="flex gap-2">
                            <motion.button
                              onClick={() => handleSave(user.id)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg shadow-glow hover:shadow-glow-hover transition-all duration-300 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Save size={16} className="mr-1" />
                              Save
                            </motion.button>
                            <motion.button
                              onClick={() => setEditingUser(null)}
                              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <X size={16} className="mr-1" />
                              Cancel
                            </motion.button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Phone:</span>{" "}
                            {user.phonenum || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">State:</span>{" "}
                            {user.state || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Role:</span>{" "}
                            {user.role || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">Status:</span>{" "}
                            {user.enabled ? "Enabled" : "Disabled"}
                          </p>
                          <div className="flex gap-2 mt-4">
                            <motion.button
                              onClick={() => handleEdit(user)}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg shadow-glow hover:shadow-glow-hover transition-all duration-300 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(user.id)}
                              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg shadow-glow-red hover:shadow-glow-red-hover transition-all duration-300 flex items-center justify-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 pointer-events-none rounded-xl border border-transparent hover:border-blue-400/30 transition-all duration-300" />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400">
                  No users found.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Embedded Styles */}
      <style jsx>{`
        .shadow-glow {
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        .shadow-glow-hover:hover {
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.7);
        }
        .shadow-glow-red {
          box-shadow: 0 0 10px rgba(239, 68, 68, 0.5);
        }
        .shadow-glow-red-hover:hover {
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.7);
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminUserPanel;