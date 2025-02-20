import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";

export const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        e.target.reset();
        setTimeout(() => setIsSubmitted(false), 2500);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div id="webcrumbs">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Success Animation */}
        {isSubmitted && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 backdrop-blur-sm transition-all">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center animate-pop-in">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="checkmark animate-checkmark"
                  viewBox="0 0 52 52"
                  style={{ width: 32, height: 32 }}
                >
                  <path
                    className="checkmark__check"
                    fill="none"
                    stroke="#FFF"
                    strokeWidth="4"
                    strokeLinecap="round"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Success!</h3>
              <p className="text-gray-600">
                Our team will reach out to you shortly!
              </p>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 py-16">
          <section className="text-left max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-4xl font-bold text-center mb-8 animate-pulse">
              Contact Us
            </h2>
            <form
              onSubmit={handleSubmit}
              method="POST"
              className="grid md:grid-cols-2 gap-12"
            >
              <input
                type="hidden"
                name="access_key"
                value="87c6a13e-cb0a-4053-991b-c8c151167bff"
              ></input>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    required
                    type="text"
                    name="Name"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Your Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    name="Email"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <input
                    required
                    type="text"
                    name="Query"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    name="Message"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 h-32"
                    placeholder="Your message here..."
                  />
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transform hover:scale-105 transition-all duration-200">
                  Send Message
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Get in Touch</h3>
                  <p className="text-gray-600">
                    We'd love to hear from you. Our friendly team is always here
                    to chat.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-200">
                      <span className="material-symbols-outlined text-blue-600">
                        location_on
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Office</h4>
                      <p className="text-gray-600">Ahmedabad</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                      <span className="material-symbols-outlined text-purple-600">
                        mail
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Email</h4>
                      <p className="text-gray-600">
                        bitecodes.global@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 group">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                      <span className="material-symbols-outlined text-green-600">
                        phone
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">Phone</h4>
                      <p className="text-gray-600">+91 94287-67709</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href="/"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faFacebookF} />
                    </a>
                    <a
                      href="/"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faXTwitter} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/bite-codes/"
                      rel="noreferrer"
                      target="_blank"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                    <a
                      href="https://www.instagram.com/bitecodes.co"
                      rel="noreferrer"
                      target="_blank"
                      className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200"
                    >
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </section>
        </main>
      </div>
    </div>
  );
};
export default Contact;