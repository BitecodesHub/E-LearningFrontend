import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const ExamResult = () => {
  const { attemptId } = useParams(); // Get attemptId from URL
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    fetch(`${apiUrl}/api/exams/result/${attemptId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Exam Result:", data);
        setResult(data);
      })
      .catch((err) => console.error("Error fetching result:", err));
  }, [attemptId]);

  if (!result) {
    return <div className="text-center text-xl font-bold mt-10">Loading results...</div>;
  }

  const { score, passed } = result;
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex justify-between">
      <div className="flex-grow w-full bg-white rounded-xl shadow-xl p-10 text-center">
        {passed ? (
          <h1 className="text-4xl font-bold text-green-600">🎉 Congratulations! You Passed! 🎉</h1>
        ) : (
          <h1 className="text-4xl font-bold text-red-600">😢 You Failed! Try Again!</h1>
        )}
        <p className="text-2xl mt-4">Your Score: <span className="font-bold">{score}%</span></p>
        <button
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/attempts")}
        >
          Go to Attempts
        </button>
      </div>
    </div>
  );
};
