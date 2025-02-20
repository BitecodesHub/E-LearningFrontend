import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Avatar from 'react-avatar';

export const About = () => {
  return (
    <div id="webcrumbs">
      <div className="max-w-full mx-auto bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl overflow-hidden p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-8">
          <details className="group bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out border border-slate-100">
            <summary className="list-none cursor-pointer">
              <Avatar name="Ismail Mansuri" size="100" round className="mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-center mb-3">Ismail</h2>
              <p className="text-slate-600 text-center font-medium">BackEnd Developer</p>
              <div className="flex justify-center space-x-6 mt-8">
                <FaGithub className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
                <FaLinkedin className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
              </div>
            </summary>
            <div className="mt-6 text-slate-600">
              <p className="mb-4">1+ years of experience in BackEnd development</p>
			  <div className="flex justify-center flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">SpringBoot</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">Node.js</span>
                <span className="px-3 py-1 bg-blue-100 rounded-full text-sm">MySql</span>
              </div>
            </div>
          </details>

          <details className="group bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out border border-slate-100">
            <summary className="list-none cursor-pointer">
              <Avatar name="Karan" size="100" round className="mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-center mb-3">Karan</h2>
              <p className="text-slate-600 text-center font-medium">FrontEnd Developer</p>
              <div className="flex justify-center space-x-6 mt-8">
                <FaGithub className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
                <FaLinkedin className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
              </div>
            </summary>
            <div className="mt-6 text-slate-600">

			  <p className="mb-4">FrontEnd specialist with good grip in React</p>
			  <div className="flex justify-center flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">React</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">Angular</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">JavaScript</span>
              </div>
            </div>
          </details>

          <details className="group bg-white rounded-2xl p-10 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out border border-slate-100">
            <summary className="list-none cursor-pointer">
              <Avatar name="Hamzah" size="100" round className="mx-auto mb-4" />
              <h2 className="text-2xl font-extrabold text-center mb-3">Hamzah</h2>
              <p className="text-slate-600 text-center font-medium">UI/UX Designer</p>
              <div className="flex justify-center space-x-6 mt-8">
                <FaGithub className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
                <FaLinkedin className="text-3xl hover:scale-125 transition-transform duration-300 cursor-pointer" />
              </div>
            </summary>
            <div className="mt-6 text-slate-600">
			<p className="mb-4">Creative designer with focus on user experience</p>
			<div className="flex justify-center flex-wrap gap-2">
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">Figma</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">Adobe XD</span>
                <span className="px-3 py-1 bg-purple-100 rounded-full text-sm">Sketch</span>
              </div>
            </div>
          </details>
        </div>

        <div className="bg-white p-16 border-t border-slate-100">
          <h3 className="text-4xl font-black mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Our College Project</h3>
          <p className="text-slate-600 text-center max-w-4xl mx-auto leading-relaxed mb-12 text-lg">
            This website represents our collaborative effort as a college project. We combined our diverse skills in development, design, and programming to create a meaningful and functional platform. Our team worked together to implement modern technologies and create an engaging user experience.
          </p>
          <div className="flex justify-center space-x-8">
            <button className="group inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined mr-3 group-hover:rotate-12 transition-transform">code</span>
              View Project
            </button>
            <button className="group inline-flex items-center px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <span className="material-symbols-outlined mr-3 group-hover:rotate-12 transition-transform">school</span>
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};