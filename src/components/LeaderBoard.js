import React, { useEffect, useState } from "react";

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

  return (
    <div className="w-full min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Leaderboard</h1>
        {loading && <p className="text-center text-gray-500">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!loading && !error && (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Rank</th>
                <th className="border p-2">Student Name</th>
                <th className="border p-2">Course</th>
                <th className="border p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((student, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2 font-bold">{index + 1}</td>
                  <td className="border p-2">{student.userName}</td>
                  <td className="border p-2">{student.courseName}</td>
                  <td className="border p-2 text-blue-600 font-semibold">{student.score}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
