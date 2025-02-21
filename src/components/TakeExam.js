import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const TakeExam = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    fetch(`${apiUrl}/api/exams/course/${courseId}/random`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setLoading(false);
      });
  }, [courseId, apiUrl]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitExam = () => {
    setSubmitting(true); // Show waiting message
    fetch(`${apiUrl}/api/exams/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 1, courseId, answers }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate(`/result/${data.id}`);
      })
      .catch((err) => {
        console.error("Error submitting exam:", err);
        setSubmitting(false);
      });
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col">
      <div className="flex-grow w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-10 my-10">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">Exam</h1>

        {/* Timer */}
        <div className="text-center text-lg font-semibold text-gray-600">
          Time Left: <span className="text-red-500">{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>

        {/* Show Loading Spinner While Fetching Questions */}
        {loading ? (
          <div className="flex justify-center items-center mt-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin"></div>
          </div>
        ) : submitting ? (
          /* Show "Waiting for result..." with spinner */
          <div className="flex flex-col items-center mt-6">
            <p className="text-lg font-semibold text-gray-700">Waiting for result...</p>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin mt-3"></div>
          </div>
        ) : questions.length > 0 ? (
          <>
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                {currentQuestionIndex + 1}. {questions[currentQuestionIndex].questionText}
              </h2>

              {/* Options */}
              <div className="grid grid-cols-1 gap-3">
                {["A", "B", "C", "D"].map((option) => (
                  <label
                    key={option}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                      answers[questions[currentQuestionIndex].id] === option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name={questions[currentQuestionIndex].id}
                      value={option}
                      checked={answers[questions[currentQuestionIndex].id] === option}
                      onChange={() => handleAnswerChange(questions[currentQuestionIndex].id, option)}
                      className="hidden"
                    />
                    {questions[currentQuestionIndex][`option${option}`]}
                  </label>
                ))}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                className={`px-6 py-2 rounded-lg text-white font-semibold ${
                  currentQuestionIndex === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-gray-700 hover:bg-gray-900"
                }`}
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  className="px-6 py-2 bg-green-500 hover:bg-green-700 text-white rounded-lg font-semibold"
                  onClick={submitExam}
                >
                  Submit
                </button>
              ) : (
                <button
                  className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold"
                  onClick={nextQuestion}
                >
                  Next
                </button>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 mt-6">No questions available.</p>
        )}
      </div>
    </div>
  );
};
