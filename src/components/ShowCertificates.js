import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export const ShowCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, userFirstName, userId } = useAuth();

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

  // Function to get course name by courseId
  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const certificateElement = document.getElementById("certificate");
    if (certificateElement) { 
      const data = certificateElement.outerHTML;
      const blob = new Blob([data], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.html";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="w-full">
        <main className="bg-gray-100 min-h-screen p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="non_certificate text-3xl font-semibold text-center mb-6">
              Your Certificates
            </h1>

            {loading ? (
              <p className="text-center text-gray-500">
                Loading certificates...
              </p>
            ) : certificates.length > 0 ? (
              <div className="mb-8">
                <div className="w-64">
                  <span className="non_certificate block text-lg font-semibold mb-2">
                    Select Certificate:
                  </span>
                  <div className="non_certificate space-y-3">
                    {certificates.map((certificate, index) => (
                      <div
                        key={certificate.id}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 ease-in-out cursor-pointer"
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl font-semibold text-blue-600">
                            {index + 1}.
                          </span>
                          <span className="text-2xl font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-300">
                            {getCourseName(certificate.courseId)} Certificate
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600">
                No certificates found.
              </p>
            )}

            {selectedCertificate && (
              <div id="certificate" className="border-8 border-blue-100 p-12">
                <div className="text-center mb-12">
                  <img
                    src="https://dummyimage.com/200x200/ddd/000&text=LWL"
                    alt="Institute Logo"
                    className="h-24 mx-auto mb-6 hover:scale-105 transition-transform"
                  />
                  <h1 className="text-4xl font-serif mb-4">
                    Certificate of Completion
                  </h1>
                  <p className="text-lg text-gray-600">
                    This is to certify that
                  </p>
                </div>

                <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold mb-4 text-blue-800">
                    {userFirstName}
                  </h2>
                  <p className="text-lg text-gray-600">
                    has successfully completed the course
                  </p>
                  <h3 className="text-2xl font-semibold mt-4">
                    {getCourseName(selectedCertificate.courseId)}
                  </h3>
                </div>

                <div className="text-center mb-16">
                  <p className="text-gray-600">with a score of</p>
                  <span className="text-2xl font-bold text-blue-800">
                    {selectedCertificate.score}%
                  </span>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="text-sm">Credential ID:</span>
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                    {selectedCertificate.credentialId}
                  </span>
                </div>

                <div className="flex justify-between items-end mt-16">
                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2">
                      <span className="material-symbols-outlined text-blue-800">
                        verified
                      </span>
                      <p className="font-semibold">Course Instructor</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-gray-600 mb-4">Issued on</p>
                    <p className="font-semibold">
                      {new Date(
                        selectedCertificate.issuedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="border-t-2 border-gray-400 pt-2">
                      <span className="material-symbols-outlined text-blue-800">
                        school
                      </span>
                      <p className="font-semibold">Institute Director</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedCertificate && (
              <div className="non_certificate text-center mt-8 flex justify-center gap-4">
                <button
                  onClick={handlePrint}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">print</span>
                  Print Certificate
                </button>

                <button
                  onClick={handleDownload}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
