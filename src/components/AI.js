import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LearnWithoutLimitsAI = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isStopped, setIsStopped] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const chatHistoryRef = useRef([]);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const welcomeMessage = "👋 Welcome to Learn Without Limits AI! I'm here to help you master any subject. What would you like to learn today?";
    setTimeout(() => {
      appendMessage(welcomeMessage, "ai-message");
    }, 500);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [chatMessages, loading]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleMinimize = () => setMinimized((prev) => !prev);

  const appendMessage = (text, className) => {
    chatHistoryRef.current.push({ text, className, id: Date.now() });
    setChatMessages([...chatHistoryRef.current.slice(-50)]);
  };

  const generate = async () => {
    if (!message.trim()) return;
    
    setIsStopped(false);
    setMessage("");
    setLoading(true);
    appendMessage(message, "user-message");
    appendMessage("", "ai-message");
    
    controllerRef.current = new AbortController();
    
    try {
      const response = await fetch("https://ai.learnwithoutlimits.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "stable-code:3b", prompt: message, stream: true }),
        signal: controllerRef.current.signal,
      });
    
      if (!response.ok) throw new Error("Error fetching response");
    
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let tempText = "";
    
      while (true) {
        const { done, value } = await reader.read();
        if (done || isStopped) break;
    
        const chunk = decoder.decode(value, { stream: true });
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            try {
              const json = JSON.parse(line.replace("data: ", "").trim());
              if (json.response) {
                tempText += json.response;
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        });
    
        setChatMessages((prev) => {
          const updatedMessages = [...prev];
          updatedMessages[updatedMessages.length - 1].text = tempText;
          return updatedMessages;
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Generation stopped by user.");
      } else {
        console.error(error);
        appendMessage("⚠️ Oops! We encountered an issue while generating your response. Please try again.", "ai-message");
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    setIsStopped(true);
    controllerRef.current?.abort();
    setLoading(false);
  };

  const handleInputChange = (event) => setMessage(event.target.value);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      toggleGenerate();
    }
  };

  const toggleGenerate = () => {
    if (loading) stopGeneration();
    else generate();
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
      className={`min-h-screen flex justify-center items-center p-4 transition-colors duration-500 ${isDarkMode ? "bg-gradient-to-br from-gray-900 to-purple-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}>
      
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
          minimized ? "h-24" : "h-[90vh]"
        } ${isDarkMode ? "bg-gray-800 shadow-purple-700/30" : "bg-white shadow-blue-300/50"}`}
      >
        {/* Header */}
        <header className={`p-4 sm:p-6 flex justify-between items-center ${isDarkMode ? "bg-gray-800" : "bg-white"} border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold"
            >
              L
            </motion.div>
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500"
            >
              Learn Without Limits AI
            </motion.h1>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme} 
              className={`p-2 sm:p-3 rounded-full transition ${isDarkMode ? "bg-gray-700 text-amber-300" : "bg-gray-200 text-blue-600"}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? "🌙" : "☀️"}
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMinimize} 
              className={`p-2 sm:p-3 rounded-full transition ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
              aria-label="Minimize or expand"
            >
              {minimized ? "🔼" : "🔽"}
            </motion.button>
          </div>
        </header>

        <AnimatePresence>
          {!minimized && (
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-[calc(90vh-80px)]"
            >
              {/* Chat Container */}
              <div 
                ref={chatContainerRef} 
                className={`flex-grow overflow-y-auto p-4 sm:p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
              >
                <AnimatePresence>
                  {chatMessages.map((msg) => (
                    <motion.div 
                      key={msg.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-4 flex ${msg.className === "user-message" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.className === "ai-message" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold mr-2 mt-1">
                          AI
                        </div>
                      )}
                      <div 
                        className={`max-w-[85%] p-3 sm:p-4 rounded-2xl ${
                          msg.className === "user-message" 
                            ? `bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20` 
                            : `${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-800"} shadow-md ${isDarkMode ? "shadow-gray-900/50" : "shadow-gray-200/50"}`
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                      </div>
                      {msg.className === "user-message" && (
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold ml-2 mt-1">
                          You
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <div className="flex items-center text-sm text-gray-400 mt-2 ml-10">
                    <div className="flex space-x-1 mr-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 0 }}
                        className="w-2 h-2 rounded-full bg-purple-500"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2, repeatDelay: 0 }}
                        className="w-2 h-2 rounded-full bg-indigo-500"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4, repeatDelay: 0 }}
                        className="w-2 h-2 rounded-full bg-blue-500"
                      />
                    </div>
                    Learning in progress...
                  </div>
                )}
              </div>

              {/* Input Section */}
              <div className={`p-4 sm:p-6 ${isDarkMode ? "bg-gray-800 border-t border-gray-700" : "bg-white border-t border-gray-200"}`}>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <motion.textarea
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(99, 102, 241, 0.4)" }}
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className={`flex-grow p-3 sm:p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                      isDarkMode 
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" 
                        : "bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500"
                    }`}
                    placeholder="Ask anything you want to learn..."
                    style={{ minHeight: '50px', maxHeight: '150px' }}
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleGenerate} 
                    className={`p-3 sm:p-4 rounded-xl font-semibold shadow-lg transition flex items-center justify-center min-w-[90px] ${
                      loading 
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30" 
                        : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/30"
                    }`}
                  >
                    {loading ? (
                      <>
                        <span className="mr-2">Stop</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <rect x="6" y="6" width="8" height="8" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">Send</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-500">
                  Unlock your learning potential with AI-powered education
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default LearnWithoutLimitsAI;
