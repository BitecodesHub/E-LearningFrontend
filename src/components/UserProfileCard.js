import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUserPlus, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ user, currentUserId }) => {
  const [requestSent, setRequestSent] = useState(false);
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  const handleConnect = async () => {
    if (!currentUserId) return; // Prevent action if no current user
    try {
      await axios.post(`${apiUrl}/api/auth/connect`, {
        senderId: currentUserId,
        receiverId: user.id,
      });
      setRequestSent(true);
    } catch (err) {
      console.error("Failed to send connection request:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.profileurl || "https://webcrumbs.cloud/placeholder"}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{user.username}</h3>
          <p className="text-sm text-indigo-600 dark:text-indigo-400">{user.role}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{user.bio || "No bio available."}</p>
      <div className="space-y-2">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Skills:</span>{" "}
          {user.skills?.length > 0 ? user.skills.map((skill) => skill.name).join(", ") : "None"}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Timezone:</span> {user.timezone || "Not set"}
        </p>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="font-medium">Availability:</span> {user.availability || "Not set"}
        </p>
      </div>
      <div className="mt-6 flex gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleConnect}
          disabled={requestSent || !currentUserId || user.id === currentUserId}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            requestSent || !currentUserId || user.id === currentUserId
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 dark:bg-indigo-700 text-white"
          }`}
        >
          <FiUserPlus />
          {requestSent ? "Request Sent" : "Connect"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/chat/${user.id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg"
        >
          <FiMessageSquare />
          Chat
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;