import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct way for latest versions


export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "USER",
  });
  const [message, setMessage] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const apiUrl =
    process.env.REACT_APP_ENV === "production"
      ? process.env.REACT_APP_LIVE_API
      : process.env.REACT_APP_LOCAL_API;

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
  };

  // Validate form before submission
  const validateForm = () => {
    if (!formData.username.trim()) {
      setMessage("Username cannot be empty.");
      return false;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage("Please enter a valid email address.");
      return false;
    }
    if (formData.password.length < 6) {
      setMessage("Password must be at least 6 characters.");
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, formData);
      if (response.status === 200) {
        setMessage("Registered successfully. Check your email for OTP.");
        navigate("/verify-otp", { state: { email: formData.email } });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  // Handle Google OAuth login
  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const token = credentialResponse.credential;
  
      // Decode the JWT token to extract user details
      const decoded = jwtDecode(token); // Use jwtDecode (not jwt_decode)
      const { email, name, picture } = decoded;
  
      // Send user details directly to backend
      const response = await axios.post(`${apiUrl}/api/auth/google-auth`, {
        email,
        name,
        picture,
      });
  
      if (response.data.success) {
        setMessage("Google login successful.");
        navigate("/login");
      } else {
        setMessage("Google authentication failed.");
      }
    } catch (error) {
      console.error("Google Login Failed", error);
      setMessage("Google authentication failed.");
    }
  };
  
  
  return (
    <GoogleOAuthProvider clientId="373447199487-17q7ruiigmv5c612s0sjbdb65dmcpm5i.apps.googleusercontent.com">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4 sm:px-0 py-8">
        <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
          <div className="mb-4 sm:mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold">Join Us Today</h1>
            <p className="mt-2 text-sm sm:text-base">Create an account to get started</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full rounded-lg border px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full rounded-lg border px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-lg border px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full rounded-lg border px-4 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-300 outline-none"
              required
            />

            {/* Terms & Conditions */}
            <div className="flex items-center text-sm sm:text-base">
              <input
                type="checkbox"
                id="terms"
                checked={termsChecked}
                onChange={handleTermsChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
              />
              <label htmlFor="terms" className="ml-2">
                I agree to the <span className="text-blue-600 font-medium">Terms & Conditions</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 transition-all"
            >
              Create Account
            </button>
          </form>

          {/* OR Separator */}
          <div className="mt-4 text-center text-sm font-medium">OR</div>

          {/* Google OAuth Login */}
          <div className="mt-4 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={() => setMessage("Google login failed.")}
            />
          </div>

          {/* Error Message Display */}
          {message && (
            <div className="mt-4 text-center text-sm text-red-600">
              {message}
            </div>
          )}

          {/* Login Redirect */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};
