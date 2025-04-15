import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertCircle, FiAward, FiCalendar, FiCheckCircle, FiHash } from "react-icons/fi";

export const CertificateQr = () => {
  const { credentialId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchCertificate = async () => {
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

    fetchCertificate();
  }, [credentialId, apiUrl]);

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-100 to-purple-200 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-lg transition-all duration-300 hover:shadow-2xl border border-blue-100"
      >
        <div className="text-center mb-6">
          <FiAward className="w-14 h-14 text-blue-600 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-gray-900">Credential Verification</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Validate the authenticity of this certificate.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Fetching details...</p>
        ) : certificate ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-50 to-purple-100 p-6 rounded-xl border border-blue-200 shadow-md"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-serif font-bold text-blue-800">{certificate.userFirstName}</h2>
              <p className="text-gray-700 text-lg">has successfully completed</p>

              <div className="bg-white p-4 rounded-lg shadow-inner">
                <h3 className="text-xl font-semibold text-gray-900">{certificate.courseName}</h3>
                <div className="flex justify-center items-baseline gap-2 mt-2">
                  <span className="text-3xl font-bold text-purple-600">{certificate.score}%</span>
                  <span className="text-gray-600 text-sm">Final Score</span>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-white p-4 rounded-lg shadow-inner mt-4 text-gray-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Issued On</span>
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-gray-500" />
                    <span>{new Date(certificate.issuedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-medium">Valid Through</span>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-green-500" />
                    <span>{certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString() : "Lifetime"}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-medium">Credential ID</span>
                  <div className="flex items-center gap-2">
                    <FiHash className="text-gray-500" />
                    <span className="font-mono">{certificate.credentialId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row sm:justify-between text-xs md:text-sm text-gray-600">
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
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center p-5 bg-red-50 rounded-xl mt-4 flex items-center justify-center gap-3"
          >
            <FiAlertCircle className="text-red-600 w-6 h-6" />
            <span className="text-red-700 text-lg font-medium">No certificate found for this ID</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
