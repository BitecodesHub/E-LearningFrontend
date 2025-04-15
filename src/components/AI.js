"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Sun, Moon, Minimize2, Maximize2, Send, Square } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

// Utility to detect code language
const detectLanguage = (code) => {
  if (code.includes("public class")) return "java";
  if (code.includes("def ") || code.includes("print(")) return "python";
  if (code.includes("console.log")) return "javascript";
  if (code.includes("#include")) return "cpp";
  return "plaintext";
};

const LearnWithoutLimitsAI = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingState, setStreamingState] = useState({
    tempText: "",
    currentCodeBlock: "",
    codeLanguage: "",
    isInCodeBlock: false,
  });
  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);

  // Initialize welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "🌌 Greetings, knowledge seeker! I'm your AI guide to mastering any subject. What's sparking your curiosity today?",
      className: "ai-message",
      code: null,
    };
    setTimeout(() => {
      setChatMessages([welcomeMessage]);
    }, 500);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatMessages, loading]);

  // Cleanup controller on unmount
  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  const appendMessage = (text, className, code = null) => {
    setChatMessages((prev) => {
      const newMessage = { id: Date.now(), text, className, code };
      return [...prev.slice(-50), newMessage];
    });
  };

  const updateLastMessage = (text, code = null) => {
    setChatMessages((prev) => {
      const updatedMessages = [...prev];
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        text,
        code,
      };
      return updatedMessages;
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("📋 Code copied!");
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg z-50 transition-transform transform scale-100 opacity-100 animate-bounce`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("scale-0");
      toast.classList.remove("opacity-100");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const extractCodeFromText = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)\n```/g;
    let remainingText = text;
    const codeBlocks = [];

    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      const language = match[1] || detectLanguage(match[2]);
      const code = match[2].trim();
      codeBlocks.push({ language, code });
      remainingText = remainingText.replace(match[0], "");
    }

    return {
      code: codeBlocks.length ? codeBlocks : null,
      text: remainingText.trim() || "",
    };
  };

  const generate = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    setMessage("");
    setLoading(true);
    appendMessage(userMessage, "user-message");

    controllerRef.current = new AbortController();
    setStreamingState({
      tempText: "",
      currentCodeBlock: "",
      codeLanguage: "",
      isInCodeBlock: false,
    });

    try {
      const response = await fetch("https://ai.bitecodes.com/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "stable-code:3b", prompt: userMessage, stream: true }),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Failed to fetch response");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      appendMessage("", "ai-message"); // Placeholder for streaming response

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          const { code, text } = extractCodeFromText(
            streamingState.tempText +
              (streamingState.isInCodeBlock
                ? `\n\`\`\`\n${streamingState.currentCodeBlock}\n\`\`\``
                : "")
          );
          updateLastMessage(text, code);
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        chunk.split("\n").forEach((line) => {
          if (line.startsWith("data:")) {
            try {
              const json = JSON.parse(line.replace("data: ", "").trim());
              if (json.response) {
                const text = json.response;

                setStreamingState((prev) => {
                  let { tempText, currentCodeBlock, codeLanguage, isInCodeBlock } = prev;

                  if (text.includes("```")) {
                    if (isInCodeBlock) {
                      isInCodeBlock = false;
                      const { code, text: extractedText } = extractCodeFromText(
                        `\`\`\`${codeLanguage}\n${currentCodeBlock}\n\`\`\``
                      );
                      tempText += extractedText;
                      updateLastMessage(tempText, code);
                      currentCodeBlock = "";
                      codeLanguage = "";
                    } else {
                      isInCodeBlock = true;
                      const langMatch = text.match(/```(\w+)/);
                      codeLanguage = langMatch ? langMatch[1] : detectLanguage(text);
                    }
                  } else if (isInCodeBlock) {
                    currentCodeBlock += text + "\n";
                  } else {
                    tempText += text;
                    updateLastMessage(tempText);
                  }

                  return {
                    tempText,
                    currentCodeBlock,
                    codeLanguage,
                    isInCodeBlock,
                  };
                });
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        updateLastMessage(streamingState.tempText + "\n[Stopped by user]");
      } else {
        appendMessage("⚠️ Oops, something went wrong! Please try again.", "ai-message");
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
      setStreamingState({
        tempText: "",
        currentCodeBlock: "",
        codeLanguage: "",
        isInCodeBlock: false,
      });
    }
  };

  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setLoading(false);
      updateLastMessage(streamingState.tempText + "\n[Stopped by user]");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (loading) stopGeneration();
      else generate();
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex justify-center items-center p-4 sm:p-6 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-100"
      } transition-colors duration-500 font-sans`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-full max-w-[90vw] sm:max-w-4xl rounded-3xl shadow-2xl overflow-hidden backdrop-blur-lg ${
          isMinimized ? "h-16 sm:h-20" : "h-[85vh] sm:h-[90vh]"
        } ${
          isDarkMode
            ? "bg-gray-800/80 shadow-indigo-500/30"
            : "bg-white/80 shadow-blue-300/50"
        } transition-all duration-500`}
      >
        {/* Header */}
        <header
          className={`flex items-center justify-between p-4 sm:p-5 ${
            isDarkMode ? "bg-gray-850/50" : "bg-white/50"
          } border-b ${
            isDarkMode ? "border-gray-700/20" : "border-gray-200/20"
          } backdrop-blur-lg`}
        >
          <div className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base sm:text-lg"
            >
              L
            </motion.div>
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
            >
              Learn Without Limits AI
            </motion.h1>
          </div>
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 sm:p-3 rounded-full ${
                isDarkMode ? "bg-gray-700/50 text-amber-300" : "bg-gray-200/50 text-blue-600"
              } hover:bg-indigo-500/20 transition-colors`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Moon className="w-4 sm:w-5 h-4 sm:h-5" />
              ) : (
                <Sun className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMinimize}
              className={`p-2 sm:p-3 rounded-full ${
                isDarkMode ? "bg-gray-700/50 text-gray-300" : "bg-gray-200/50 text-gray-700"
              } hover:bg-indigo-500/20 transition-colors`}
              aria-label="Minimize or expand"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 sm:w-5 h-4 sm:h-5" />
              ) : (
                <Minimize2 className="w-4 sm:w-5 h-4 sm:h-5" />
              )}
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <AnimatePresence>
          {!isMinimized && (
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col h-[calc(85vh-72px)] sm:h-[calc(90vh-80px)]"
            >
              {/* Chat Area */}
              <div
                ref={chatContainerRef}
                className={`flex-grow overflow-y-auto p-4 sm:p-6 ${
                  isDarkMode ? "bg-gray-900/50" : "bg-gray-50/50"
                } overscroll-contain`}
              >
                <AnimatePresence>
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      variants={fadeInUp}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className={`mb-4 flex ${
                        msg.className === "user-message" ? "justify-end" : "justify-start"
                      } items-end`}
                    >
                      {msg.className === "ai-message" && (
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-2 sm:mr-3 shrink-0">
                          AI
                        </div>
                      )}
                      <div className="flex flex-col max-w-[80%] sm:max-w-[70%]">
                        {msg.text && (
                          <div
                            className={`p-3 sm:p-4 rounded-2xl ${
                              msg.className === "user-message"
                                ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20"
                                : isDarkMode
                                ? "bg-gray-800/70 text-gray-200 shadow-gray-900/30"
                                : "bg-white/70 text-gray-800 shadow-gray-200/30"
                            } text-sm sm:text-base whitespace-pre-wrap`}
                          >
                            {msg.text}
                          </div>
                        )}
                        {msg.code &&
                          msg.code.map(({ language, code }, index) => (
                            <div
                              key={index}
                              className={`mt-2 p-3 rounded-xl ${
                                isDarkMode ? "bg-gray-700/70" : "bg-gray-100/70"
                              } relative`}
                            >
                              <SyntaxHighlighter
                                language={language}
                                style={isDarkMode ? oneDark : oneLight}
                                customStyle={{ fontSize: "0.875rem", margin: 0, padding: "0.5rem" }}
                                showLineNumbers
                              >
                                {code}
                              </SyntaxHighlighter>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(code)}
                                className={`absolute top-2 right-2 p-1.5 rounded-md ${
                                  isDarkMode
                                    ? "bg-gray-600/50 text-gray-200"
                                    : "bg-gray-200/50 text-gray-800"
                                } hover:bg-indigo-500/20 transition-colors`}
                              >
                                <Copy className="w-4 h-4" />
                              </motion.button>
                            </div>
                          ))}
                      </div>
                      {msg.className === "user-message" && (
                        <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold ml-2 sm:ml-3 shrink-0">
                          You
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center text-sm text-gray-400 mt-4 ml-12 sm:ml-14"
                  >
                    <div className="flex space-x-1 mr-2">
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2 }}
                        className="w-2 h-2 rounded-full bg-indigo-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                        className="w-2 h-2 rounded-full bg-purple-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                        className="w-2 h-2 rounded-full bg-pink-400"
                      />
                    </div>
                    Thinking...
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div
                className={`p-4 sm:p-6 ${
                  isDarkMode
                    ? "bg-gray-850/50 border-t border-gray-700/20"
                    : "bg-white/50 border-t border-gray-200/20"
                } backdrop-blur-lg`}
              >
                <div className="flex items-end space-x-2 sm:space-x-3">
                  <motion.textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    className={`flex-grow p-3 sm:p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all touch-manipulation ${
                      isDarkMode
                        ? "bg-gray-700/70 border-gray-600/50 text-gray-100 placeholder-gray-400"
                        : "bg-gray-50/70 border-gray-300/50 text-gray-900 placeholder-gray-500"
                    } text-sm sm:text-base`}
                    placeholder="Ask anything you want to learn..."
                    style={{ minHeight: "50px", maxHeight: "150px" }}
                    whileFocus={{ boxShadow: "0 0 0 3px rgba(99, 102, 241, 0.2)" }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loading ? stopGeneration : generate}
                    className={`p-3 sm:p-4 rounded-xl font-semibold shadow-lg transition-colors flex items-center justify-center min-w-[80px] sm:min-w-[100px] ${
                      loading
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-indigo-500/20"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Square className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Send className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2" />
                        Send
                      </>
                    )}
                  </motion.button>
                </div>
                <div className="mt-2 text-xs text-center text-gray-400">
                  Powered by AI to unlock your learning potential
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