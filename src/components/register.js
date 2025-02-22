import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock, FiAlertCircle } from "react-icons/fi";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const response = await axios.post("http://localhost:8080/api/auth/register", formData);
      console.log("Registration successful:", response.data);
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500/20 via-purple-400/20 to-blue-400/20 p-4 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border p-8"
        >
          <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">Create Your Account</h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            {["username", "email", "password", "confirmPassword"].map((field, index) => (
              <div key={index} className="relative">
                {field === "username" && <FiUser className="absolute left-3 top-3 text-indigo-500" />}
                {field === "email" && <FiMail className="absolute left-3 top-3 text-indigo-500" />}
                {field.includes("password") && <FiLock className="absolute left-3 top-3 text-indigo-500" />}
                <input
                  type={
                    field.includes("password")
                      ? field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : showConfirmPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                  className="w-full pl-10 pr-10 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
                  required
                />
                {field.includes("password") && (
                  <button
                    type="button"
                    className="absolute right-3 top-3 text-indigo-500"
                    onClick={() =>
                      field === "password"
                        ? setShowPassword(!showPassword)
                        : setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {field === "password" ? (showPassword ? <FiEyeOff /> : <FiEye />) : showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                )}
              </div>
            ))}
            <div className="flex items-center">
              <input type="checkbox" id="terms" checked={termsChecked} onChange={handleTermsChange} className="mr-2" />
              <label htmlFor="terms">I agree to the Terms & Conditions</label>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-indigo-500 text-white py-3 rounded-xl shadow-lg hover:shadow-indigo-300/30">
              Sign Up
            </motion.button>
            {message && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 p-3 bg-pink-50 text-pink-700 rounded-lg border border-pink-100">
                <FiAlertCircle className="flex-shrink-0" />
                <span>{message}</span>
              </motion.div>
            )}
          </form>
          <div className="my-6 text-center">or continue with</div>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={() => navigate("/login")} onError={() => setMessage("Google login failed.")} />
          </div>
          <p className="mt-6 text-center text-gray-600">
            Already have an account? <button onClick={() => navigate("/login")} className="text-indigo-600 underline">Log in</button>
          </p>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
};