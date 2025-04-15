import React from "react";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChatPage = () => {
  const userId = sessionStorage.getItem("userId"); // Ensure this value is stored correctly


  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <p className="text-gray-600 dark:text-gray-400">Please log in to chat.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600"
      >
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">
          Chat with User {userId}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          This is a placeholder for pair programming and collaboration tools. Implement real-time chat or integrate with tools like VS Code Live Share.
        </p>
      </motion.div>
    </div>
  );
};

export default ChatPage;