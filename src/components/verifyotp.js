import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for redirection

export const VerifyOtp = () => {
  const location = useLocation(); // Get location object
  const navigate = useNavigate(); // Initialize navigate function
  const email = location.state?.email; // Retrieve email from state
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch("https://www.elearningbackend.bitecodes.com/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp: otp,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // Show success message
        // Redirect to /home after successful OTP verification
        navigate("/login");
      } else {
        const errorResponse = await response.json();
        setMessage(errorResponse.message); // Show backend error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-6 sm:py-8">
      <div className="mx-auto w-full max-w-[480px] px-4 sm:px-0">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="mb-6 sm:mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">Verify OTP</h1>
            <p className="mt-2 text-xs sm:text-sm">Please enter the verification code sent to your email</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter OTP"
                  maxLength="6"
                  className="w-full rounded-lg border border-gray-200 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base text-center tracking-widest transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
              
              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-2.5 sm:py-3 text-sm sm:text-base text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify OTP
              </button>
            </div>
          </form>

          {message && (
            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-green-600">
              {message}
            </div>
          )}

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            Didn't receive the code?{" "}
            <a href="#" className="ml-1 font-medium text-blue-600 hover:text-blue-700">
              Resend OTP
            </a>
          </div>

          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
              Go back
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
