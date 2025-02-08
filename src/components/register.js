import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

export const Register = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    role: "USER",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [termsChecked, setTermsChecked] = useState(false); // State for terms checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked); // Set the checkbox state
  };

  // Validate email, password matching, and terms acceptance
  const validateForm = () => {
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return false;
    }
    if (!termsChecked) {
      setMessage("You must agree to the Terms and Conditions.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return; // If validation fails, do not proceed

    try {
      const response = await fetch("https://www.elearningbackend.bitecodes.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setMessage("Registered successfully. Please check your email for OTP.");
        // Redirect to /verify-otp after successful registration
        navigate("/verify-otp", { state: { email: formData.email } }); // Pass email to verify-otp page
      } else {
        const errorResponse = await response.json();
        setMessage(errorResponse.message); // Show backend error message
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 sm:px-0 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-xl sm:text-2xl font-bold">Learn Without Limits</h1>
          <p className="mt-2 text-sm sm:text-base">Create your account and start learning today</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 sm:space-y-5">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="UserName"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <input
              type={showPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
            />

            <div className="flex items-center text-sm sm:text-base">
              <input
                type="checkbox"
                id="terms"
                checked={termsChecked}
                onChange={handleTermsChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="terms" className="ml-2">
                I agree to the Terms and Conditions
              </label>
            </div>

            {/* <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handlePasswordVisibility}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                {showPassword ? "Hide" : "Show"} Password
              </button>
            </div> */}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all"
            >
              Create Account
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 text-center text-sm text-red-600">
            {message}
          </div>
        )}

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
};
