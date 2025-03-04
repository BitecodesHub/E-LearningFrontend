import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const TakeExam = () => {
  const { courseId } = useParams();
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = useMemo(() => 
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API,
    []
  );

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${apiUrl}/api/exams/course/${courseId}/random`);
        
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        setQuestions(data);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load exam questions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId && apiUrl) {
      fetchQuestions();
    }
  }, [courseId, apiUrl]);

  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }
    
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = String(timeLeft % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const progress = useMemo(() => {
    if (!questions.length) return 0;
    return Object.keys(answers).length / questions.length * 100;
  }, [answers, questions]);

  const isCurrentQuestionAnswered = useMemo(() => {
    if (!questions.length) return false;
    return !!answers[questions[currentQuestionIndex]?.id];
  }, [answers, questions, currentQuestionIndex]);

  const handleAnswerChange = useCallback((questionId, option) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Modified submit function with 'E' default
  const submitExam = useCallback(async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Create completed answers with 'E' for unanswered questions
      const completedAnswers = questions.reduce((acc, question) => {
        acc[question.id] = answers[question.id] || 'E';
        return acc;
      }, {});

      const response = await fetch(`${apiUrl}/api/exams/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, answers: completedAnswers }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      navigate(`/result/${data.id}`);
    } catch (err) {
      console.error("Error submitting exam:", err);
      setError("Failed to submit exam. Please try again.");
      setSubmitting(false);
    }
  }, [apiUrl, userId, courseId, answers, navigate, submitting, questions]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || submitting) return;
      
      if (e.key === "ArrowLeft") {
        prevQuestion();
      } else if (e.key === "ArrowRight") {
        nextQuestion();
      } else if (e.key >= "1" && e.key <= "4" && questions[currentQuestionIndex]) {
        const optionMap = { "1": "A", "2": "B", "3": "C", "4": "D" };
        handleAnswerChange(questions[currentQuestionIndex].id, optionMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, submitting, prevQuestion, nextQuestion, handleAnswerChange, questions, currentQuestionIndex]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0 && !submitting) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, submitting]);

  const currentQuestion = useMemo(() => 
    questions[currentQuestionIndex] || null,
    [questions, currentQuestionIndex]
  );
  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      submitExam();
      return;
    }
    
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format timer display
  

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (loading || submitting) return;
      
      if (e.key === "ArrowLeft") {
        prevQuestion();
      } else if (e.key === "ArrowRight") {
        nextQuestion();
      } else if (e.key >= "1" && e.key <= "4" && questions[currentQuestionIndex]) {
        // Map 1-4 to A-D
        const optionMap = { "1": "A", "2": "B", "3": "C", "4": "D" };
        handleAnswerChange(questions[currentQuestionIndex].id, optionMap[e.key]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [loading, submitting, prevQuestion, nextQuestion, handleAnswerChange, questions, currentQuestionIndex]);

  // Confirmation before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (Object.keys(answers).length > 0 && !submitting) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, submitting]);

  // Current question
 
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col">
      <div className="flex-grow w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 my-6">
        {/* Header with timer */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Exam</h1>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-lg font-semibold text-red-600" aria-live="polite" role="timer">
                {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          ></div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center my-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin" aria-label="Loading"></div>
          </div>
        ) : error ? (
          /* Error state */
          <div className="text-center my-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : submitting ? (
          /* Submitting state */
          <div className="flex flex-col items-center my-12">
            <p className="text-lg font-semibold text-gray-700 mb-4">Submitting your exam...</p>
            <div className="w-12 h-12 border-4 border-blue-500 border-t-purple-500 rounded-full animate-spin" aria-label="Submitting"></div>
          </div>
        ) : questions.length > 0 && currentQuestion ? (
          <div className="flex flex-col md:flex-row gap-6">
            {/* Question navigation sidebar */}
            <div className="w-full md:w-48 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-3">Questions</h2>
              <div className="grid grid-cols-4 md:grid-cols-3 gap-2">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(idx)}
                    className={`w-full h-10 flex items-center justify-center rounded-md font-medium transition-colors
                      ${currentQuestionIndex === idx ? 'bg-blue-500 text-white' : 
                        answers[q.id] ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    aria-label={`Go to question ${idx + 1}${answers[q.id] ? ' (answered)' : ''}`}
                    aria-current={currentQuestionIndex === idx ? 'true' : 'false'}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              
              {/* Summary */}
              <div className="mt-6 bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{Object.keys(answers).length}</span> of <span className="font-medium">{questions.length}</span> answered
                </p>
              </div>
            </div>
            
            {/* Main question area */}
            <div className="flex-grow">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-700 mb-4">
                  {currentQuestionIndex + 1}. {currentQuestion.questionText}
                </h2>

                {/* Options */}
                <div className="grid grid-cols-1 gap-3">
                  {["A", "B", "C", "D"].map((option) => (
                    <label
                      key={option}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors
                        ${answers[currentQuestion.id] === option
                          ? "bg-blue-500 text-white"
                          : "bg-gray-50 hover:bg-gray-100"}`}
                      htmlFor={`question-${currentQuestion.id}-option-${option}`}
                    >
                      <input
                        id={`question-${currentQuestion.id}-option-${option}`}
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={() => handleAnswerChange(currentQuestion.id, option)}
                        className="mr-3"
                      />
                      <span className="font-medium mr-2">{option}.</span> {currentQuestion[`option${option}`]}
                    </label>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors
                    ${currentQuestionIndex === 0 
                      ? "bg-gray-300 cursor-not-allowed" 
                      : "bg-gray-700 hover:bg-gray-900"}`}
                  onClick={prevQuestion}
                  disabled={currentQuestionIndex === 0}
                  aria-label="Previous question"
                >
                  Previous
                </button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    className={`px-6 py-2 text-white rounded-lg font-semibold transition-colors
                      ${Object.keys(answers).length === questions.length
                        ? "bg-green-500 hover:bg-green-700"
                        : "bg-blue-500 hover:bg-blue-700"}`}
                    onClick={submitExam}
                  >
                    {Object.keys(answers).length === questions.length ? "Submit Exam" : "Submit (some questions unanswered)"}
                  </button>
                ) : (
                  <button
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                    onClick={nextQuestion}
                    aria-label="Next question"
                  >
                    {isCurrentQuestionAnswered ? "Next" : "Skip"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-12">No questions available for this exam.</p>
        )}
        
        {/* Keyboard shortcuts help */}
        {!loading && !submitting && questions.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              <span className="font-medium">Keyboard shortcuts:</span> Arrow keys to navigate questions, number keys 1-4 to select options A-D
            </p>
          </div>
        )}
      </div>
    </div>
  );
};