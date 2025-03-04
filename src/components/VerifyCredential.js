import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiAlertCircle, FiAward, FiCopy, FiCheckCircle, FiShield, FiClock, FiUsers } from "react-icons/fi";

export const VerifyCredential = () => {
  const [credentialId, setCredentialId] = useState("");
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const apiUrl = process.env.REACT_APP_ENV === "production"
    ? process.env.REACT_APP_LIVE_API || "https://api.bitecodes.com"
    : process.env.REACT_APP_LOCAL_API || "http://localhost:3001";

  const handleCopyId = () => {
    if (certificate?.credentialId) {
      navigator.clipboard.writeText(certificate.credentialId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => console.error("Failed to copy: ", err));
    }
  };

  const handleSearch = async () => {
    if (!credentialId.trim()) {
      setError("Please enter a Credential ID.");
      return;
    }

    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      const certResponse = await fetch(`${apiUrl}/api/certificates/credential/${credentialId.trim()}`);
      
      if (!certResponse.ok) {
        throw new Error(
          certResponse.status === 404 
            ? "Certificate not found" 
            : `Server error: ${certResponse.status}`
        );
      }
      
      const certData = await certResponse.json();
      
      const [userResponse, courseResponse] = await Promise.all([
        fetch(`${apiUrl}/api/auth/getUsername/${certData.userId}`),
        fetch(`${apiUrl}/course/getCourseName/${certData.courseId}`)
      ]);
      
      if (!userResponse.ok) throw new Error("User information unavailable");
      if (!courseResponse.ok) throw new Error("Course information unavailable");
      
      const userName = await userResponse.text();
      const courseName = await courseResponse.text();
      
      setCertificate({
        ...certData,
        userFirstName: userName,
        courseName: courseName,
      });
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
      console.error("Verification error:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Sample credential ID for demonstration
  const sampleCredentialId = "bcd-5678-efgh-9012";

  return (
    <div className="w-full min-h-screen p-6 md:p-8 bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center">
      {/* Animated background elements */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-20 left-1/4 w-48 h-48 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-32 right-1/4 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"
      />

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center mb-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          Digital Credential Verification
        </motion.h1>
      </div>

      {/* Verification Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg relative z-10 transition-all duration-300 hover:shadow-2xl"
      >
        <div className="text-center mb-6 md:mb-8">
          <FiAward className="w-12 h-12 md:w-16 md:h-16 text-blue-600 mx-auto mb-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Verify Credential</h2>
          <p className="text-gray-500 text-sm md:text-base">Enter your credential ID to verify authenticity</p>
          
          {/* Sample Credential ID */}
          {!certificate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xs text-gray-400"
            >
              Sample ID: {sampleCredentialId}
            </motion.div>
          )}
        </div>

        {/* Input Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              value={credentialId}
              onChange={(e) => {
                setCredentialId(e.target.value);
                if (error) setError("");
              }}
              placeholder="Enter Credential ID"
              className="border-2 border-gray-200 rounded-xl px-4 py-3 md:px-6 md:py-4 w-full text-sm md:text-base focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute -bottom-6 left-0 text-red-500 text-xs md:text-sm flex items-center gap-1"
                >
                  <FiAlertCircle /> <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !credentialId.trim()}
            className={`px-4 py-3 md:px-6 md:py-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${
              loading ? "bg-gray-400 cursor-not-allowed" :
              credentialId.trim() 
                ? "bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 hover:shadow-lg active:scale-95"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <FiSearch className="text-lg" />
                <span>Verify</span>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {certificate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-6 md:p-8 rounded-xl border-2 border-blue-100 mt-4 overflow-hidden"
            >
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-white/80 px-2 py-1 rounded-lg backdrop-blur-sm">
                <span className="text-blue-800 text-xs md:text-sm font-medium">#{certificate.credentialId}</span>
                <button 
                  onClick={handleCopyId}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {copied ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
                </button>
              </div>

              <div className="text-center space-y-3">
                <div className="mb-4">
                  <h2 className="text-2xl md:text-4xl font-serif font-bold text-blue-800">{certificate.userFirstName}</h2>
                  <p className="text-gray-600 text-sm md:text-lg">has successfully completed</p>
                </div>

                <div className="bg-white p-3 md:p-4 rounded-lg shadow-inner mb-4">
                  <h3 className="text-lg md:text-2xl font-semibold text-gray-800">{certificate.courseName}</h3>
                  <div className="flex justify-center items-baseline gap-2 mt-2">
                    <span className="text-2xl md:text-4xl font-bold text-purple-600">{certificate.score}%</span>
                    <span className="text-gray-500 text-sm md:text-base">Final Score</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-6 text-gray-500 text-sm md:text-base">
                  <div>
                    <span className="block font-medium text-gray-600">Issued On</span>
                    <span className="font-medium text-blue-700">
                      {formatDate(certificate.issuedAt)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-gray-200 hidden sm:block" />
                  <div>
                    <span className="block font-medium text-gray-600">Valid Through</span>
                    <span className="font-medium text-blue-700">Lifetime</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm text-gray-500">
                <span className="block sm:inline text-center sm:text-left">
                  <strong>Verify at:</strong>  
                  <a href="https://elearning.bitecodes.com/credential-verify" 
                    className="text-blue-600 font-semibold hover:underline ml-1"
                    target="_blank"
                    rel="noopener noreferrer">
                    elearning.bitecodes.com/credential-verify
                  </a>
                </span>
                <span className="block sm:inline text-center sm:text-right mt-2 sm:mt-0">
                  <strong>Powered by:</strong>  
                  <span className="text-purple-600 font-semibold ml-1">Learn Without Limits</span>
                </span>
              </div>
            </motion.div>
          )}

          {error === "Certificate not found" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center p-6 bg-yellow-50 rounded-xl mt-4 flex flex-col items-center justify-center gap-3"
            >
              <FiAlertCircle className="text-yellow-600 text-2xl" />
              <div>
                <p className="text-yellow-700 font-medium">No certificate found with this ID</p>
                <p className="text-yellow-600 text-sm mt-1">Please check the ID and try again</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature Grid */}
      <motion.div 
        className="grid md:grid-cols-3 gap-6 mt-12 max-w-6xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <FiShield className="w-8 h-8 text-blue-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Secure Verification</h3>
          <p className="text-gray-600">Blockchain-powered verification ensures credentials are tamper-proof and authentic</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <FiClock className="w-8 h-8 text-purple-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Lifetime Validity</h3>
          <p className="text-gray-600">Digital credentials never expire and can be verified anytime, anywhere</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
          <FiUsers className="w-8 h-8 text-green-600 mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">Global Recognition</h3>
          <p className="text-gray-600">Accepted by employers and institutions worldwide</p>
        </div>
      </motion.div>

    </div>
  );
};