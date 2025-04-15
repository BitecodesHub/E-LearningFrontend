import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiFilter, FiUserPlus } from "react-icons/fi";
import UserProfileCard from "./UserProfileCard";

const CommunityPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]); // Initialize as empty array
  const [filters, setFilters] = useState({
    skills: [],
    role: "",
    timezone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  const userId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }
    fetchCurrentUser();
    fetchUsers();
  }, [filters, userId, token]);

  const fetchCurrentUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(response.data);
    } catch (err) {
      console.error("Failed to load current user:", err);
      setError("Failed to load user data. Please log in again.");
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("token");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.skills.length) params.append("skills", filters.skills.join(","));
      if (filters.role) params.append("role", filters.role);
      if (filters.timezone) params.append("timezone", filters.timezone);

      const response = await axios.get(`${apiUrl}/api/auth/filter`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Filter API response:", response.data); // Debug log
      // Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Expected an array, received:", response.data);
        setUsers([]);
        setError("Unexpected response from server. Please try again.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err.response?.data?.message || "Failed to load users. Please try again.");
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const skillsList = ["JavaScript", "Python", "Java", "React", "Spring Boot"];
  const rolesList = ["Software Developer", "Data Scientist", "DevOps Engineer"];
  const timezonesList = ["America/New_York", "Europe/London", "Asia/Tokyo"];

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <p className="text-gray-600 dark:text-gray-400">Please log in to access the community.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
          Community - Find Your Coding Partner
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
          Connect with like-minded developers, pair program, and build projects together.
        </p>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Smart Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillsList.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleSkillToggle(skill)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      filters.skills.includes(skill)
                        ? "bg-indigo-600 dark:bg-indigo-700 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Role</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
              >
                <option value="">Any Role</option>
                {rolesList.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timezone</label>
              <select
                name="timezone"
                value={filters.timezone}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-600"
              >
                <option value="">Any Timezone</option>
                {timezonesList.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* User Grid */}
        {loading ? (
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500 dark:border-indigo-400 border-t-purple-500 dark:border-t-purple-400 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 dark:text-red-400">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length > 0 ? (
              users.map((u) => (
                <UserProfileCard key={u.id} user={u} currentUserId={currentUser?.id} />
              ))
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400">No users found.</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CommunityPage;