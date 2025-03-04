import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload, FiAward, FiCalendar, FiUser, FiHash } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { 
  SiPython, SiCplusplus, SiMysql, SiMongodb, SiRust, 
  SiReact, SiJavascript, SiHtml5, SiCss3, SiNodedotjs,
  SiPhp, SiAngular, SiVuedotjs, SiDjango, SiFlask,
  SiTensorflow, SiDocker, SiKubernetes
} from "react-icons/si";
// import { SiAmazon } from "react-icons/si";
import { DiJava } from "react-icons/di";
import { BsCodeSquare, BsStars, BsShield } from "react-icons/bs";
import { FaGraduationCap, FaMedal } from "react-icons/fa";
import confetti from "canvas-confetti";

// Extended course icons with fallback categories
const courseIcons = {
  // Programming Languages
  python: <SiPython size={50} color="#306998" />,
  java: <DiJava size={50} color="#007396" />,
  javascript: <SiJavascript size={50} color="#F7DF1E" />,
  "c++": <SiCplusplus size={50} color="#00599C" />,
  "c#": <BsCodeSquare size={50} color="#512BD4" />,
  rust: <SiRust size={50} color="#DEA584" />,
  php: <SiPhp size={50} color="#777BB4" />,
  
  // Databases
  mysql: <SiMysql size={50} color="#4479A1" />,
  mongodb: <SiMongodb size={50} color="#47A248" />,
  postgresql: <BsCodeSquare size={50} color="#336791" />,
  
  // Frontend
  react: <SiReact size={50} color="#61DAFB" />,
  angular: <SiAngular size={50} color="#DD0031" />,
  vue: <SiVuedotjs size={50} color="#4FC08D" />,
  
  // Backend & Frameworks
  node: <SiNodedotjs size={50} color="#339933" />,
  
  // Category icons for fallbacks
  frontend: <SiHtml5 size={50} color="#E34F26" />,
  backend: <SiNodedotjs size={50} color="#339933" />,
  database: <SiMysql size={50} color="#4479A1" />,
  security: <BsShield size={50} color="#4050B5" />
};

export const ShowCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(false);
  const certificateRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

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
        
        // Extract unique categories and filter out any undefined values
        if (Array.isArray(courseData)) {
          const uniqueCategories = [...new Set(
            courseData
              .map(course => course.category)
              .filter(category => category !== undefined)
          )];
          setCategories(uniqueCategories);
        }
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
    return course ? course.name.toLowerCase() : "unknown course";
  };

  const getCourseCategory = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course && course.category ? course.category : "Coding";
  };

  const getCourseIcon = (courseId) => {
    const courseName = getCourseName(courseId);
    const category = getCourseCategory(courseId);
    
    // First try direct match by course name
    if (courseIcons[courseName]) {
      return courseIcons[courseName];
    }
    
    // Try to match by course name substring
    for (const key in courseIcons) {
      if (courseName.includes(key)) {
        return courseIcons[key];
      }
    }
    
    // Fall back to category
    if (category && courseIcons[category.toLowerCase()]) {
      return courseIcons[category.toLowerCase()];
    }
    
    // Ultimate fallback
    return <FaGraduationCap size={50} color="#6B7280" />;
  };

  const handleCertificateClick = (certificate) => {
    setSelectedCertificate((prev) => {
      if (prev?.id === certificate.id) {
        return null;
      } else {
        // Trigger confetti when a new certificate is selected
        if (certificate) {
          triggerConfetti();
        }
        return certificate;
      }
    });
  };

  const triggerConfetti = () => {
    const duration = 2000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4F46E5', '#3B82F6', '#EC4899', '#8B5CF6']
      });
      
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4F46E5', '#3B82F6', '#EC4899', '#8B5CF6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    
    setLoadingDownload(true);

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(certificateRef.current, {
          backgroundColor: "#ffffff",
          scale: window.innerWidth < 768 ? 2 : 3,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight) * 0.9;
        
        const x = (pdfWidth - canvasWidth * ratio) / 2;
        const y = (pdfHeight - canvasHeight * ratio) / 2;
        
        pdf.addImage(imgData, "PNG", x, y, canvasWidth * ratio, canvasHeight * ratio);
        pdf.save(`${getCourseName(selectedCertificate.courseId)}_certificate.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setLoadingDownload(false);
      }
    }, 500);
  };

  const filteredCertificates = activeCategory === "all" 
    ? certificates
    : certificates.filter(cert => {
        const category = getCourseCategory(cert.courseId);
        return category && category.toLowerCase() === activeCategory.toLowerCase();
      });

  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 min-h-screen p-4 md:p-8">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with badge icon */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg"
          >
            <FiAward className="text-white text-4xl" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Your Achievements
          </h1>
          <p className="text-gray-600 mt-2 text-center max-w-lg">
            Showcase your hard-earned certificates and share your accomplishments with the world.
          </p>
        </div>

        {/* Filter tabs */}
        {categories.length > 0 && !loading && certificates.length > 0 && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full transition-all ${
                  activeCategory === "all"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory("all")}
              >
                All Certificates
              </motion.button>
              
              {categories.map(category => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full transition-all ${
                    activeCategory === category.toLowerCase()
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory(category.toLowerCase())}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full mb-4"
            ></motion.div>
            <p className="text-indigo-700 font-medium">Loading your achievements...</p>
          </div>
        ) : certificates.length > 0 ? (
          <>
            <AnimatePresence>
              {filteredCertificates.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {filteredCertificates.map((certificate) => (
                    <motion.div
                      key={certificate.id}
                      className={`bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all ${
                        selectedCertificate?.id === certificate.id ? "ring-2 ring-indigo-500" : ""
                      }`}
                      onClick={() => handleCertificateClick(certificate)}
                      whileHover={{ y: -5 }}
                      layout
                    >
                      <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3 flex items-center justify-center">
                            {getCourseIcon(certificate.courseId)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 capitalize">
                              {getCourseName(certificate.courseId)}
                            </h3>
                            <div className="flex items-center mt-2 text-gray-600">
                              <FaMedal className="text-amber-500 mr-1" />
                              <span className="text-sm">Score: <span className="font-medium">{certificate.score}%</span></span>
                            </div>
                            <div className="flex items-center mt-1 text-gray-600">
                              <FiCalendar className="mr-1" />
                              <span className="text-sm">
                                {new Date(certificate.issuedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <span className="inline-block mt-3 text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                              {getCourseCategory(certificate.courseId)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-600">No certificates found in this category.</p>
                </div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <motion.div
            className="text-center py-12 bg-gray-50 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Certificates Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Complete a course and pass the final exam to earn your first certificate.
            </p>
          </motion.div>
        )}

        {/* Selected Certificate View */}
        <AnimatePresence>
          {selectedCertificate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mt-12 pt-8 border-t border-gray-100"
            >
              <div
                ref={certificateRef}
                className="certificate-container relative p-2 md:p-8 bg-white rounded-xl overflow-hidden"
              >
                {/* Certificate border decoration */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-0 border-[15px] border-indigo-100 rounded-xl"></div>
                  <div className="absolute inset-[15px] border-[2px] border-dashed border-indigo-300 rounded-xl"></div>
                </div>
                
                {/* Certificate Content */}
                <div className="relative py-10 px-8 text-center">
                  {/* Certificate Header */}
                  <div className="mb-6">
                    <div className="flex justify-center mb-3">
                      <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center">
                        <FiAward className="text-white text-2xl" />
                      </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-1">
                      Certificate of Achievement
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mb-3 rounded-full"></div>
                    <p className="text-gray-600 italic">This certifies that</p>
                  </div>
                  
                  {/* Recipient Name */}
                  <h2 className="text-3xl md:text-4xl font-bold text-indigo-800 my-4 font-serif certificate-name">
                    {userFirstName}
                  </h2>
                  
                  {/* Course Details */}
                  <p className="text-lg text-gray-600 mt-4">has successfully completed the course</p>
                  <div className="flex flex-col items-center justify-center mt-3 mb-6">
                    <div className="flex items-center justify-center my-2">
                      <div className="bg-indigo-50 p-4 rounded-full">
                        {getCourseIcon(selectedCertificate.courseId)}
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 capitalize">
                      {getCourseName(selectedCertificate.courseId)}
                    </h3>
                    <span className="inline-block mt-2 text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                      {getCourseCategory(selectedCertificate.courseId)}
                    </span>
                  </div>
                  
                  {/* Certificate Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
                    <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <FaMedal className="text-amber-500 mr-1" />
                        <span className="text-sm font-medium text-gray-700">Score</span>
                      </div>
                      <span className="font-bold text-lg text-indigo-800">
                        {selectedCertificate.score}%
                      </span>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <FiCalendar className="text-indigo-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">Issued On</span>
                      </div>
                      <span className="font-bold text-indigo-800">
                        {new Date(selectedCertificate.issuedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-3 flex flex-col items-center">
                      <div className="flex items-center justify-center mb-1">
                        <FiHash className="text-indigo-600 mr-1" />
                        <span className="text-sm font-medium text-gray-700">Credential ID</span>
                      </div>
                      <span className="font-bold text-indigo-800 text-sm">
                        {selectedCertificate.credentialId.substring(0, 12)}
                      </span>
                    </div>
                  </div>
                  
                  {/* QR Code Section */}
                  <div className="mt-8 flex justify-center">
                    <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
                      <QRCodeCanvas
                        value={`elearning.bitecodes.com/credential/${selectedCertificate.credentialId}`}
                        size={120}
                        bgColor="#ffffff"
                        fgColor="#1F2937"
                        level="H"
                        includeMargin={true}
                      />
                      <p className="text-xs text-gray-600 mt-2 text-center font-medium">Scan to Verify</p>
                    </div>
                  </div>
                  
                  {/* Certificate Footer */}
                  <div className="mt-8 border-t border-gray-200 pt-4 text-sm text-gray-600">
                    <p>This certificate verifies the completion of the online course as indicated above.</p>
                  </div>
                </div>
              </div>
              
              {/* Download Button */}
              <motion.div 
                className="text-center mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
                  disabled={loadingDownload}
                >
                  {loadingDownload ? (
                    <AiOutlineLoading3Quarters className="animate-spin text-xl" />
                  ) : (
                    <FiDownload className="text-xl" />
                  )}
                  {loadingDownload ? "Generating PDF..." : "Download Certificate"}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};