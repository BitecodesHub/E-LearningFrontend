import React from "react";
import Avatar from "react-avatar";
import { FaGithub, FaLinkedin, FaReact, FaFigma } from "react-icons/fa";
import { SiSpringboot, SiNodedotjs, SiMysql, SiAngular } from "react-icons/si";
import { motion } from "framer-motion";

export const About = () => {
  const teamMembers = [
    {
      name: "Ismail Mansuri",
      role: "BackEnd Developer",
      skills: [
        { name: "SpringBoot", icon: <SiSpringboot className="w-4 h-4" /> },
        { name: "Node.js", icon: <SiNodedotjs className="w-4 h-4" /> },
        { name: "MySQL", icon: <SiMysql className="w-4 h-4" /> }
      ],
      color: "bg-blue-100",
      experience: "1+ years of experience in BackEnd development"
    },
    {
      name: "Karan",
      role: "FrontEnd Developer",
      skills: [
        { name: "React", icon: <FaReact className="w-4 h-4" /> },
        { name: "Angular", icon: <SiAngular className="w-4 h-4" /> },
        { name: "JavaScript", icon: <span className="text-sm">JS</span> }
      ],
      color: "bg-purple-100",
      experience: "FrontEnd specialist with expertise in modern frameworks"
    },
    {
      name: "Hamzah",
      role: "UI/UX Designer",
      skills: [
        { name: "Figma", icon: <FaFigma className="w-4 h-4" /> },
        { name: "Adobe XD", icon: <span className="text-sm">XD</span> },
        { name: "Sketch", icon: <span className="text-sm">SK</span> }
      ],
      color: "bg-pink-100",
      experience: "Creative designer focused on user-centered experiences"
    }
  ];

  return (
    <div id="webcrumbs" className="py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-[40px] shadow-2xl shadow-blue-100/30 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8 lg:p-12">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 ease-out border border-slate-100"
            >
              <div className="flex flex-col items-center">
                <div className="relative mb-6">
                  <Avatar
                    name={member.name}
                    size="120"
                    round
                    className="border-4 border-white shadow-lg"
                  />
                  <div className={`absolute -bottom-2 right-0 ${member.color} rounded-full p-2 shadow-sm`}>
                    {member.skills[0].icon}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {member.name.split(" ")[0]}
                </h2>
                <p className="text-gray-600 font-medium mb-6">{member.role}</p>
                
                <div className="flex space-x-4 mb-6">
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaGithub className="text-2xl" />
                  </motion.a>
                  <motion.a 
                    whileHover={{ scale: 1.1 }}
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin className="text-2xl" />
                  </motion.a>
                </div>

                <div className="w-full">
                  <p className="text-gray-600 text-center mb-4">{member.experience}</p>
                  <div className="flex justify-center flex-wrap gap-2">
                    {member.skills.map((skill, i) => (
                      <motion.span
                        key={i}
                        whileHover={{ y: -2 }}
                        className={`px-3 py-1.5 ${member.color} rounded-full text-sm font-medium flex items-center gap-2`}
                      >
                        {skill.icon}
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-8 lg:px-20 border-t border-slate-100">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Collaborative Innovation
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              This platform is the culmination of our academic collaboration, blending diverse expertise in 
              full-stack development, intuitive design, and robust architecture. We've leveraged cutting-edge 
              technologies to create a seamless user experience that demonstrates our collective capabilities.
            </p>
            
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};