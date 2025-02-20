import React, { useState } from "react";

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
    setLoading(true);
    setError("");
    setCertificate(null);

    try {
      // Step 1: Fetch Certificate Details
      const certResponse = await fetch(`${apiUrl}/api/certificates/credential/${credentialId}`);
      if (!certResponse.ok) throw new Error("Certificate not found");

      const certData = await certResponse.json();
      
      // Step 2: Fetch User Name
      const userResponse = await fetch(`${apiUrl}/api/auth/getUsername/${certData.userId}`);
      if (!userResponse.ok) throw new Error("User not found");

      const userData = await userResponse.text();

      // Step 3: Fetch Course Name
      const courseResponse = await fetch(`${apiUrl}/course/getCourseName/${certData.courseId}`);
      if (!courseResponse.ok) throw new Error("Course not found");

      const courseName = await courseResponse.text();

      // Step 4: Update Certificate Data
      setCertificate({
        ...certData,
        userFirstName: userData, // Adjust based on actual response key
        courseName: courseName,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-6">Verify Certificate</h1>
        <div className="flex gap-4">
          <input
            type="text"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="Enter Credential ID"
            className="border rounded-lg px-4 py-2 w-full"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </div>
        {loading && <p className="text-center text-gray-500 mt-4">Searching...</p>}
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
        {certificate && (
          <div className="border-8 border-blue-100 p-12 mt-6">
            <h2 className="text-3xl font-serif font-bold text-blue-800 text-center">
              {certificate.userFirstName}
            </h2>
            <p className="text-lg text-gray-600 text-center">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-semibold text-center mt-2">
              {certificate.courseName}
            </h3>
            <p className="text-center text-gray-600 mt-4">with a score of</p>
            <p className="text-2xl font-bold text-blue-800 text-center">
              {certificate.score}%
            </p>
            <div className="text-center mt-4">
              <p className="text-gray-600">Credential ID:</p>
              <p className="font-mono bg-gray-100 px-3 py-1 inline-block rounded">
                {certificate.credentialId}
              </p>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
