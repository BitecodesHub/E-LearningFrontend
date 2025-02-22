import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload } from "react-icons/fi";

export const ShowCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const certificateRef = useRef(null);

  const { userFirstName, userId } = useAuth();

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const certRes = await fetch(`${apiUrl}/api/certificates/user/${userId}`);
        const certData = await certRes.json();
        setCertificates(Array.isArray(certData) ? certData : []);

        const courseRes = await fetch(`${apiUrl}/course/getCourses`);
        const courseData = await courseRes.json();
        setCourses(Array.isArray(courseData) ? courseData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, apiUrl]);

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate((prev) => (prev?.id === certificate.id ? null : certificate));
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      backgroundColor: "#ffffff", // Fixes grey background issue
      scale: 3, // Higher resolution for better clarity
      useCORS: true, // Avoids cross-origin issues for QR Code
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("landscape", "mm", "a4");
    pdf.addImage(imgData, "PNG", 10, 10, 280, 190);
    pdf.save("certificate.pdf");
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen p-8 flex justify-center">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Your Certificates</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading certificates...</p>
        ) : certificates.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {certificates.map((certificate) => (
              <motion.div
                key={certificate.id}
                className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition"
                onClick={() => handleCertificateClick(certificate)}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold text-blue-900">
                  {getCourseName(certificate.courseId)} Certificate
                </h3>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No certificates found.</p>
        )}

        {selectedCertificate && (
          <motion.div
            ref={certificateRef}
            className="border-8 border-blue-200 p-10 mt-10 bg-white shadow-lg rounded-xl relative"
            style={{ backgroundColor: "white" }} // Ensures proper background
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center">
              <h1 className="text-4xl font-serif font-extrabold text-gray-900 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-lg text-gray-500 italic">This is to certify that</p>
              <h2 className="text-3xl font-bold text-blue-800 mt-2">{userFirstName}</h2>
              <p className="text-lg text-gray-600 mt-2">has successfully completed the course</p>
              <h3 className="text-2xl font-semibold mt-2 text-gray-700">
                {getCourseName(selectedCertificate.courseId)}
              </h3>
              <p className="text-lg text-gray-700 mt-3">
                with a score of <strong>{selectedCertificate.score}%</strong>
              </p>
              <p className="text-gray-600 mt-4 font-mono">
                Credential ID: <span className="text-gray-900 font-bold">{selectedCertificate.credentialId}</span>
              </p>
              <p className="text-gray-600">
                Issued on:{" "}
                <span className="font-semibold text-gray-800">
                  {new Date(selectedCertificate.issuedAt).toLocaleDateString()}
                </span>
              </p>

              {/* QR Code Section */}
              <div className="mt-6 flex justify-center">
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
                  <QRCodeCanvas
                   value={`elearning.bitecodes.com/credential/${selectedCertificate.credentialId}`}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#1F2937"
                    level="H"
                    includeMargin={true}
                  />
                  <p className="text-sm text-gray-600 mt-2 text-center font-medium">Scan to Verify</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedCertificate && (
          <motion.div className="text-center mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <button
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <FiDownload className="text-xl" />
              Download PDF
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
