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
          // Step 1: Fetch Certificate Details
          const certResponse = await fetch(`${apiUrl}/api/certificates/credential/${credentialId}`);
          const certText = await certResponse.text();
          
          if (!certText) throw new Error("Certificate not found"); // Handle empty response
      
          const certData = JSON.parse(certText);
      
          // Step 2: Fetch User Name
          const userResponse = await fetch(`${apiUrl}/api/auth/getUsername/${certData.userId}`);
          const userText = await userResponse.text();
          
          if (!userText) throw new Error("User not found"); // Handle empty response
      
          // Step 3: Fetch Course Name
          const courseResponse = await fetch(`${apiUrl}/course/getCourseName/${certData.courseId}`);
          const courseText = await courseResponse.text();
          
          if (!courseText) throw new Error("Course not found"); // Handle empty response
      
          // Step 4: Update Certificate Data
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
        <div className="w-full min-h-screen p-8 bg-gradient-to-br from-blue-50 to-purple-50 flex justify-center items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full transition-all duration-300 hover:shadow-2xl"
          >
            <div className="text-center mb-8">
              <FiAward className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Verify Credential</h1>
              <p className="text-gray-500">Enter your credential ID to verify authenticity</p>
            </div>
    
            <div className="flex gap-4 mb-8">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  placeholder="Enter Credential ID"
                  className="border-2 border-gray-200 rounded-xl px-6 py-4 w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center gap-1"
                  >
                    <FiAlertCircle className="inline" /> {error}
                  </motion.div>
                )}
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !credentialId.trim()}
                className={`px-6 py-4 rounded-xl text-white font-medium flex items-center gap-2 transition-all ${
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
                className="relative bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border-2 border-blue-100 mt-6"
              >
                <div className="absolute top-4 right-4 text-blue-500 text-sm">#{certificate.credentialId}</div>
                <div className="text-center space-y-4">
                  <div className="mb-6">
                    <h2 className="text-4xl font-serif font-bold text-blue-800 mb-2">
                      {certificate.userFirstName}
                    </h2>
                    <p className="text-gray-600 text-lg">has successfully completed</p>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg shadow-inner mb-6">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                      {certificate.courseName}
                    </h3>
                    <div className="flex justify-center items-baseline gap-2">
                      <span className="text-4xl font-bold text-purple-600">
                        {certificate.score}%
                      </span>
                      <span className="text-gray-500">Final Score</span>
                    </div>
                  </div>
    
                  <div className="flex justify-center gap-6 text-gray-500">
                    <div>
                      <span className="block text-sm">Issued On</span>
                      <span className="font-medium">
                        {new Date(certificate.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="h-8 w-px bg-gray-200" />
                    <div>
                      <span className="block text-sm">Valid Through</span>
                      <span className="font-medium">Lifetime</span>
                    </div>
                  </div>
                </div>
    
                <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-gray-400">
                  <span>Verify at: academy.com/verify</span>
                  <span>Powered by EduChain</span>
                </div>
              </motion.div>
            ) : error === "Certificate not found" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-6 bg-yellow-50 rounded-xl mt-6 flex items-center justify-center gap-2"
              >
                <FiAlertCircle className="text-yellow-600" />
                <span className="text-yellow-700">No certificate found with this ID</span>
              </motion.div>
            )}
          </motion.div>
    

        </div>
      );
    };