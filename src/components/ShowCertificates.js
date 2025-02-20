import React from "react";

export const ShowCertificates = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="webcrumbs">
      <div className="w-full">
        <main className="bg-gray-100 min-h-screen p-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <details className="w-64 non_certificate">
                <summary className="bg-blue-50 p-3 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors flex items-center justify-between">
                  <span>Select Certificate</span>
                  <span className="material-symbols-outlined">expand_more</span>
                </summary>
                <div className="absolute mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-10">
                  <div className="max-h-48 overflow-y-auto">
                    <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100">
                      Advanced Web Development
                    </div>
                    <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100">
                      Frontend Development
                    </div>
                    <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100">
                      React Mastery
                    </div>
                    <div className="p-3 hover:bg-blue-50 cursor-pointer transition-colors">
                      UI/UX Design
                    </div>
                  </div>
                </div>
              </details>
            </div>

            <div className="border-8 border-blue-100 p-12">
              <div className="text-center mb-12">
                <img
                  src="https://webcrumbs.cloud/placeholder"
                  alt="Institute Logo"
                  className="h-24 mx-auto mb-6 hover:scale-105 transition-transform"
                />
                <h1 className="text-4xl font-serif mb-4">
                  Certificate of Completion
                </h1>
                <p className="text-lg text-gray-600">This is to certify that</p>
              </div>

              <div className="text-center mb-12">
                <h2 className="text-3xl font-serif font-bold mb-4 text-blue-800">
                  John Doe Smith
                </h2>
                <p className="text-lg text-gray-600">
                  has successfully completed the course
                </p>
                <h3 className="text-2xl font-semibold mt-4">
                  Advanced Web Development
                </h3>
              </div>

              <div className="text-center mb-16">
                <p className="text-gray-600">with a grade of</p>
                <span className="text-2xl font-bold text-blue-800">95%</span>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="text-sm">Credential ID:</span>
                <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                  CERT-2023-1234
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
                  <p className="font-semibold">November 15, 2023</p>
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

            <div className="non_certificate text-center mt-8">
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
              >
                <span className="material-symbols-outlined">print</span>
                Print Certificate
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
