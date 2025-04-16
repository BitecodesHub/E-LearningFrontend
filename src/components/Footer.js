import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <footer className="bg-slate-800 text-white border-t">
      <div className="max-w-7xl mx-auto mt-0 px-4 sm:px-6 py-8">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-4">
          {/* Learn */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Learn</h3>
            <ul className="space-y-1 text-gray-300">
              {["Courses", "Resources"].map(
                (item, index) => (
                  <li key={index}>
                    <a href="/courses" className="hover:text-blue-400 transition-all">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-1 text-gray-300">
              {["About Us", "Contact"].map((item, index) => (
                <li key={index}>
                  <a href="/about" className="hover:text-blue-400 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-1 text-gray-300">
              {["Terms", "Privacy", "Cookies", "Licenses"].map((item, index) => (
                <li key={index}>
                  <a href="/terms" className="hover:text-blue-400 transition-all">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <p className="text-sm text-gray-300">
              Stay updated with our latest courses and news.
            </p>
            {submitted ? (
              <p className="text-green-500 text-sm">Thank you for subscribing!</p>
            ) : (
              <form
                className="flex items-center border border-gray-500 rounded-full overflow-hidden text-sm"
                onSubmit={handleSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="px-2 py-2 bg-blue-600 hover:bg-blue-500 transition-all text-white font-semibold"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-3 border-t border-gray-600 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© 2025 E-Learning Platform. All rights reserved.</p>
          {/* Social Icons */}
          <div className="flex space-x-4 text-lg mt-2 md:mt-0">
            <a href="/socialmedia" className="hover:text-blue-400 transition-all">
              <FaFacebook />
            </a>
            <a href="/socialmedia" className="hover:text-blue-400 transition-all">
              <FaTwitter />
            </a>
            <a href="/socialmedia" className="hover:text-blue-400 transition-all">
              <FaLinkedin />
            </a>
            <a href="/socialmedia" className="hover:text-blue-400 transition-all">
              <FaYoutube />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
