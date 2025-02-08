import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginSignup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate("/");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-xl p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">Learn Without Limits</h1>
          <p className="text-neutral-600">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
              placeholder="your@email.com"
              required
              aria-label="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 outline-none"
              placeholder="Enter your password"
              required
              aria-label="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            Sign in
          </button>
        </form>

        {error && (
          <p className="text-center text-red-600 mt-4 bg-red-100 p-2 rounded-md">
            {error}
          </p>
        )}

        <div className="mt-8 text-center">
          <p className="text-neutral-600">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-600 font-medium hover:text-blue-700 hover:underline cursor-pointer transition duration-200"
            >
              Sign up
            </span>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <span className="material-symbols-outlined text-neutral-400 hover:text-neutral-600 cursor-pointer transition duration-200">
            help
          </span>
        </div>
      </div>
    </div>
  );
};
