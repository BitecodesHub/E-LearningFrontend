import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import Framer Motion for animations

export const UserAttempts = () => {
  const [attempts, setAttempts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [certificates, setCertificates] = useState([]);
  const userId = 1; // Change this to dynamic user ID
  const navigate = useNavigate();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  // Fetch attempts
  useEffect(() => {
    fetch(`${apiUrl}/api/attempts/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Attempts:", data);
        setAttempts(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching attempts:", err));
  }, [userId, apiUrl]);

  // Fetch courses
  useEffect(() => {
    fetch(`${apiUrl}/course/getCourses`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Courses:", data);
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching courses:", err));
  }, [apiUrl]);

  // Fetch user certificates
  useEffect(() => {
    fetch(`${apiUrl}/api/certificates/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Certificates:", data);
        setCertificates(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Error fetching certificates:", err));
  }, [userId, apiUrl]);

  // Function to check if a certificate exists for a given course ID
  const hasCertificate = (courseId) => {
    return Array.isArray(certificates) && certificates.some((cert) => cert.courseId === courseId);
  };

  // Function to format date properly
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

  // Get course name by ID
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const handlePayment = async (attempt) => {
    try {
      const paymentData = new URLSearchParams({
        userId: attempt.userId,
        amount: 50, // Adjust amount if needed
        paymentMethod: "UPI",
        upiId: "user@upi",
        appName: "PhonePe",
      });

      // Initiate Payment
      const paymentResponse = await fetch(`${apiUrl}/payments/initiate?${paymentData.toString()}`, {
        method: "POST",
      });

      const result = await paymentResponse.json();
      console.log("Payment Initiation Response:", result);

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
          console.log("Razorpay Success Response:", response);

          await fetch(`${apiUrl}/payments/update?transactionId=${result.transactionId}&status=SUCCESS`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          // Issue Certificate
          const certificateResponse = await fetch(
            `${apiUrl}/api/certificates?userId=${attempt.userId}&courseId=${attempt.courseId}&score=${attempt.score}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
            }
          );

          const certResult = await certificateResponse.json();
          console.log("Certificate Issued:", certResult);

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

  // Filter attempts based on selected course
  const filteredAttempts =
    selectedCourse === "all"
      ? attempts
      : attempts.filter((attempt) => attempt.courseId === parseInt(selectedCourse));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <div className="flex-grow max-w-5xl mx-auto bg-white shadow-2xl rounded-lg p-8 my-10 w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">My Exam Attempts</h1>

        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">Select Course:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
          <p className="text-center text-gray-500">No attempts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <th className="p-4 text-left">Attempt ID</th>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Score</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttempts.map((attempt, index) => (
                  <motion.tr
                    key={attempt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">{attempt.id}</td>
                    <td className="p-4">{getCourseName(attempt.courseId)}</td>
                    <td className="p-4">{attempt.score}%</td>
                    <td className="p-4">{formatDate(attempt.attemptedAt)}</td>
                    <td className="p-4">
                      {hasCertificate(attempt.courseId) ? (
                        <span className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 text-sm">
                          Already Have Certificate
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
                          onClick={() => handlePayment(attempt)}
                        >
                          Pay
                        </motion.button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};