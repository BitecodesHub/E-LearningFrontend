import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/certificates/leaderboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }
        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [apiUrl]);

  const getMedal = (rank) => {
    return rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;
  };

  return (
    <div className="w-full min-h-screen p-6 sm:p-8 bg-gradient-to-r from-blue-100 to-blue-200 flex flex-col items-center">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-3xl sm:text-5xl font-bold text-blue-800">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-700 mt-1 sm:mt-2 text-sm sm:text-base">
          Track the top performers and celebrate their achievements!
        </p>
      </motion.div>

      {/* Leaderboard Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl"
      >
        {loading && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-300 h-6 w-full rounded-md"
              ></div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold">{error}</p>
        )}

        {/* Highlighted Top Performer */}
        {!loading && !error && leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-5 sm:p-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-xl shadow-md mb-4 sm:mb-6 text-center"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-yellow-700">
              ⭐ Top Performer
            </h2>
            <p className="text-lg sm:text-xl mt-2 font-semibold">
              {leaderboard[0]?.userName}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              {leaderboard[0]?.courseName}
            </p>
            <p className="text-xl sm:text-2xl text-yellow-600 font-bold">
              {leaderboard[0]?.score}%
            </p>
          </motion.div>
        )}

        {/* Leaderboard Table (Hidden on Mobile) */}
        <div className="hidden sm:block">
          {!loading && !error && leaderboard.length > 0 ? (
            <motion.table
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full border-collapse shadow-md rounded-lg overflow-hidden"
            >
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="border p-3 text-left">Rank</th>
                  <th className="border p-3 text-left">Student Name</th>
                  <th className="border p-3 text-left">Course</th>
                  <th className="border p-3 text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((student, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-gray-100 transition duration-300 ease-in-out"
                  >
                    <td className="border p-3 font-bold text-gray-700">
                      {getMedal(index + 1)}
                    </td>
                    <td className="border p-3 font-semibold text-gray-800">
                      {student.userName}
                    </td>
                    <td className="border p-3 text-gray-700">
                      {student.courseName}
                    </td>
                    <td className="border p-3 text-blue-600 font-bold">
                      {student.score}%
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            !loading && (
              <p className="text-center text-gray-600 mt-4">
                No leaderboard data available.
              </p>
            )
          )}
        </div>

        {/* Mobile-Friendly Card Layout */}
        <div className="sm:hidden">
          {!loading && !error && leaderboard.length > 0 ? (
            <div className="flex flex-col space-y-4">
              {leaderboard.map((student, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center"
                >
                  <p className="text-lg font-bold text-gray-800">
                    {getMedal(index + 1)} {student.userName}
                  </p>
                  <p className="text-gray-700 text-sm">{student.courseName}</p>
                  <p className="text-blue-600 text-lg font-bold">
                    {student.score}%
                  </p>
                </motion.div>
              ))}
            </div>
          ) : (
            !loading && (
              <p className="text-center text-gray-600 mt-4">
                No leaderboard data available.
              </p>
            )
          )}
        </div>
      </motion.div>
    </div>
  );
};
