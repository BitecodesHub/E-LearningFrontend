import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { TrophyIcon, CalendarDaysIcon, CheckBadgeIcon } from "@heroicons/react/24/solid";

export const UserAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [certificates, setCertificates] = useState([]);
  const userId = sessionStorage.getItem("userId");
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    fetch(`${apiUrl}/api/attempts/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setAttempts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching attempts:", err));
  }, [userId, apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/course/getCourses`)
      .then((res) => res.json())
      .then((data) => setCourses(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching courses:", err));
  }, [apiUrl]);

  useEffect(() => {
    fetch(`${apiUrl}/api/certificates/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setCertificates(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching certificates:", err));
  }, [userId, apiUrl]);

  const hasCertificate = (courseId) => {
    return Array.isArray(certificates) && certificates.some((cert) => cert.courseId === courseId);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const handlePayment = async (attempt) => {
    try {
      const params = new URLSearchParams({
        userId: attempt.userId,
        amount: 50,
        paymentMethod: "UPI",
        upiId: "user@upi",
        appName: "PhonePe",
      });

      const paymentResponse = await fetch(`${apiUrl}/payments/initiate?${params.toString()}`, {
        method: "POST",
      });

      const result = await paymentResponse.json();
      if (!result.transactionId) {
        alert("Payment initiation failed. Please try again.");
        return;
      }

      const options = {
        key: "rzp_test_mQf2cASnEwehms",
        amount: 5000,
        currency: "INR",
        name: "Your Company",
        description: "Exam Payment",
        order_id: result.transactionId,
        handler: async function (response) {
          const updateParams = new URLSearchParams({
            transactionId: result.transactionId,
            status: "SUCCESS",
          });

          await fetch(`${apiUrl}/payments/update?${updateParams.toString()}`, {
            method: "POST",
          });

          const certParams = new URLSearchParams({
            userId: attempt.userId,
            courseId: attempt.courseId,
            score: attempt.score,
          });

          await fetch(`${apiUrl}/api/certificates?${certParams.toString()}`, {
            method: "POST",
          });

          alert("Payment Successful! Certificate Issued.");
          navigate("/certificates");
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on("payment.failed", function (response) {
        console.error("Payment Failed:", response);
        alert("Payment Failed. Please try again.");
      });
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Error processing payment.");
    }
  };

  const filteredAttempts =
    selectedCourse === "all"
      ? attempts
      : attempts.filter((attempt) => attempt.courseId === parseInt(selectedCourse));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full min-h-screen flex flex-col items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4 md:p-10"
    >
      <div className="w-full max-w-6xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-2xl p-6 md:p-10">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8 text-center">
          My Exam History
        </h1>

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <label className="text-lg font-medium text-gray-700">Filter by Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full md:w-72 px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all cursor-pointer"
          >
            <option value="all">All Courses</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </div>

        {filteredAttempts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-8 rounded-xl bg-purple-50/50"
          >
            <p className="text-gray-500 text-lg">No attempts found for this course</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAttempts.map((attempt, index) => (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl p-6 flex flex-col transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                <div className="relative z-10">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {getCourseName(attempt.courseId)}
                  </h2>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <TrophyIcon className="w-5 h-5 text-amber-500" />
                    <span className={`text-sm font-medium ${
                      attempt.score >= 70 ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {attempt.score}% Score
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDaysIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {formatDate(attempt.attemptedAt)}
                    </span>
                  </div>

                  <div className="mt-4 w-full">
                    {hasCertificate(attempt.courseId) ? (
                      <div className="flex items-center justify-center gap-2 bg-emerald-100/80 text-emerald-700 py-2.5 rounded-xl text-sm">
                        <CheckBadgeIcon className="w-5 h-5" />
                        Certificate Issued
                      </div>
                    ) : attempt.score >= 70 ? (
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePayment(attempt)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2.5 rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all"
                      >
                        Get Certificate - ₹49
                      </motion.button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-rose-100/80 text-rose-700 py-2.5 rounded-xl text-sm">
                        <span>Better luck next time!</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};