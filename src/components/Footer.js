import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from "react-icons/fa";

export const Footer = () => (
  <footer className="bg-slate-800 text-white border-t">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Footer Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-4">
        {/* Learn */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Learn</h3>
          <ul className="space-y-1 text-gray-300">
            {["Courses", "Tutorials", "Documentation", "Resources"].map((item, index) => (
              <li key={index}>
                <a href="#" className="hover:text-blue-400 transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Company</h3>
          <ul className="space-y-1 text-gray-300">
            {["About Us", "Careers", "Press", "Contact"].map((item, index) => (
              <li key={index}>
                <a href="#" className="hover:text-blue-400 transition-all">{item}</a>
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
                <a href="#" className="hover:text-blue-400 transition-all">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Subscribe</h3>
          <p className="text-sm text-gray-300">Stay updated with our latest courses and news.</p>
          <form className="flex items-center border border-gray-500 rounded-full overflow-hidden text-sm">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-transparent text-white focus:outline-none placeholder-gray-400"
            />
            <button type="submit" className="px-1 py-2 text-medium bg-blue-600 hover:bg-blue-500 transition-all text-white font-semibold">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="pt-3 border-t border-gray-600 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
        <p>© 2025 E-Learning Platform. All rights reserved.</p>
        {/* Social Icons */}
        <div className="flex space-x-4 text-lg mt-2 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition-all"><FaFacebook /></a>
          <a href="#" className="hover:text-blue-400 transition-all"><FaTwitter /></a>
          <a href="#" className="hover:text-blue-400 transition-all"><FaLinkedin /></a>
          <a href="#" className="hover:text-blue-400 transition-all"><FaYoutube /></a>
        </div>
      </div>
    </div>
  </footer>
);
