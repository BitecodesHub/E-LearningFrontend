import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiAlertCircle, FiAward } from "react-icons/fi";

export const VerifyCredential = () => {
  const [credentialId, setCredentialId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  const handleSearch = async () => {
    if (!credentialId.trim()) {
      setError("Please enter a Credential ID.");
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const certResponse = await fetch(`${apiUrl}/api/certificates/credential/${credentialId}`);
      const certText = await certResponse.text();
      if (!certText) throw new Error("Certificate not found");

      const certData = JSON.parse(certText);
      const userResponse = await fetch(`${apiUrl}/api/auth/getUsername/${certData.userId}`);
      const userText = await userResponse.text();
      if (!userText) throw new Error("User not found");

      const courseResponse = await fetch(`${apiUrl}/course/getCourseName/${certData.courseId}`);
      const courseText = await courseResponse.text();
      if (!courseText) throw new Error("Course not found");

      setCertificate({
        ...certData,
        userFirstName: userText,
        courseName: courseText,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-6 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg transition-all duration-300 hover:shadow-2xl"
      >
        <div className="text-center mb-6 md:mb-8">
          <FiAward className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-3" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Verify Credential</h1>
          <p className="text-gray-500 text-sm md:text-base">Enter your credential ID to verify authenticity</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="Enter Credential ID"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 md:px-6 md:py-4 w-full text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-5 left-0 text-red-500 text-xs md:text-sm flex items-center gap-1"
              >
                <FiAlertCircle className="inline" /> {error}
              </motion.div>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !credentialId.trim()}
            className={`px-4 py-3 md:px-6 md:py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 text-sm md:text-base transition-all ${
              credentialId.trim() 
                ? "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <FiSearch className="text-lg" />
                Verify
              </>
            )}
          </button>
        </div>

        {certificate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-xl border-2 border-blue-100 mt-4"
          >
            <div className="absolute top-3 right-3 text-blue-500 text-xs md:text-sm">#{certificate.credentialId}</div>
            <div className="text-center space-y-3">
              <div className="mb-4">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-blue-800">{certificate.userFirstName}</h2>
                <p className="text-gray-600 text-sm md:text-lg">has successfully completed</p>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-lg shadow-inner mb-4">
                <h3 className="text-lg md:text-2xl font-semibold text-gray-800">{certificate.courseName}</h3>
                <div className="flex justify-center items-baseline gap-2">
                  <span className="text-2xl md:text-4xl font-bold text-purple-600">{certificate.score}%</span>
                  <span className="text-gray-500 text-sm md:text-base">Final Score</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 text-gray-500 text-sm md:text-base">
                <div>
                  <span className="block">Issued On</span>
                  <span className="font-medium">
                    {new Date(certificate.issuedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                <div>
                  <span className="block">Valid Through</span>
                  <span className="font-medium">Lifetime</span>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t pt-3 flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm text-gray-500">
              <span className="block sm:inline text-center sm:text-left">
                <strong>Verify at:</strong>  
                <a href="https://elearning.bitecodes.com/credential-verify" 
                  className="text-blue-600 font-semibold hover:underline">
                  elearning.bitecodes.com/credential-verify
                </a>
              </span>
              <span className="block sm:inline text-center sm:text-right mt-2 sm:mt-0">
                <strong>Powered by:</strong>  
                <span className="text-purple-600 font-semibold"> Learn Without Limits</span>
              </span>
            </div>
          </motion.div>
        ) : error === "Certificate not found" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-4 bg-yellow-50 rounded-xl mt-4 flex items-center justify-center gap-2 text-sm md:text-base"
          >
            <FiAlertCircle className="text-yellow-600" />
            <span className="text-yellow-700">No certificate found with this ID</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
