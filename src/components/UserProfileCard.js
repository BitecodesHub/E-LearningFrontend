import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiUserPlus, FiMessageSquare } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserProfileCard = ({ user, currentUserId }) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    if (!currentUserId || !token || !user.id || user.id === currentUserId) {
      setConnectionStatus("INVALID");
      return;
    }
    checkConnectionStatus();
  }, [currentUserId, user.id, token]);

  const checkConnectionStatus = async () => {
    try {
      // Check pending requests (sent or received)
      const pendingResponse = await axios.get(`${apiUrl}/api/auth/pending/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pendingRequests = pendingResponse.data;
      if (pendingRequests.some((req) => req.id === user.id)) {
        setConnectionStatus("PENDING");
        return;
      }

      // Check accepted connections
      const connectionsResponse = await axios.get(`${apiUrl}/api/auth/connections/${currentUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const connections = connectionsResponse.data;
      if (connections.some((conn) => conn.id === user.id)) {
        setConnectionStatus("CONNECTED");
      } else {
        setConnectionStatus("NONE");
      }
    } catch (err) {
      console.error("Failed to check connection status:", err);
      setError("Failed to load connection status.");
    }
  };

  const handleConnect = async () => {
    if (!currentUserId || !token || !user.id) {
      setError("Cannot connect at this time.");
      return;
    }
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/connect`,
        {
          senderId: currentUserId,
          receiverId: user.id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setConnectionStatus("PENDING");
      }
    } catch (err) {
      console.error("Failed to send connection request:", err);
      setError("Failed to send connection request.");
    }
  };

  const handleChatNavigation = () => {
    if (!user.id || isNaN(user.id)) {
      setError("Invalid user ID for chat.");
      return;
    }
    console.log("Navigating to chat with ID:", user.id); // Debug
    navigate(`/chat/${user.id}`);
  };

  if (error) {
    return <p className="text-red-600 dark:text-red-400">{error}</p>;
  }

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
          <p className="text-sm text-indigo-600 dark:text-indigo-400">{user.role || "No role"}</p>
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
          disabled={
            !currentUserId ||
            !user.id ||
            user.id === currentUserId ||
            connectionStatus === "PENDING" ||
            connectionStatus === "CONNECTED" ||
            connectionStatus === "INVALID"
          }
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            !currentUserId ||
            !user.id ||
            user.id === currentUserId ||
            connectionStatus === "PENDING" ||
            connectionStatus === "CONNECTED" ||
            connectionStatus === "INVALID"
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 dark:bg-indigo-700 text-white"
          }`}
        >
          <FiUserPlus />
          {connectionStatus === "PENDING"
            ? "Request Sent"
            : connectionStatus === "CONNECTED"
            ? "Connected"
            : "Connect"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleChatNavigation}
          disabled={connectionStatus !== "CONNECTED"}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            connectionStatus !== "CONNECTED"
              ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          }`}
        >
          <FiMessageSquare />
          Chat
        </motion.button>
      </div>
    </motion.div>
  );
};

export default UserProfileCard;