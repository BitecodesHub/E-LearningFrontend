import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Menu, X, Send, Square, Volume2, Save, Trash, Download, Palette, Mic, ChevronDown } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import lottie from "lottie-web";

// Detect language for code blocks
const detectLanguage = (code) => {
  if (!code || typeof code !== "string") return "plaintext";
  if (code.includes("public class") || code.includes("private void")) return "java";
  if (code.includes("def ") || code.includes("print(")) return "python";
  if (code.includes("console.log") || code.includes("function ")) return "javascript";
  if (code.includes("#include") || code.includes("int main(")) return "cpp";
  if (code.includes("<html") || code.includes("<!DOCTYPE")) return "html";
  if (code.includes("SELECT ") && code.includes(" FROM ")) return "sql";
  if (code.includes("using namespace") || code.includes("std::")) return "cpp";
  if (code.includes("package ") || code.includes("func ")) return "go";
  return "plaintext";
};

// Text-to-speech function
const speakText = (text, onStart, onEnd) => {
  if (!window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/```[\s\S]*?```/g, "Code block omitted for speech.").replace(/[^\w\s.,?!;:'"()\-\u0080-\uFFFF]/g, "");
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (event) => { console.error("Speech error:", event); if (onEnd) onEnd(); };
  window.speechSynthesis.speak(utterance);
  return true;
};

const themes = {
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
    card: "bg-gray-850/90 shadow-gray-900/30 backdrop-blur-xl",
    header: "bg-gray-900/80 border-gray-800/30",
    chat: "bg-gray-900/90",
    input: "bg-gray-800/90 border-gray-700/50 text-gray-100 placeholder-gray-500",
    codeBg: "bg-gray-800/90",
    button: "bg-gray-700/70 text-gray-200",
    sidebar: "bg-gray-850/95 border-gray-800/50 text-gray-200",
    sidebarHover: "hover:bg-gray-700/50",
  },
  light: {
    bg: "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100",
    card: "bg-white/95 shadow-gray-200/30 backdrop-blur-xl",
    header: "bg-white/90 border-gray-200/30",
    chat: "bg-gray-50/90",
    input: "bg-gray-100/90 border-gray-300/50 text-gray-900 placeholder-gray-500",
    codeBg: "bg-gray-100/90",
    button: "bg-gray-200/70 text-gray-700",
    sidebar: "bg-white/95 border-gray-200/50 text-gray-900",
    sidebarHover: "hover:bg-gray-300/50",
  },
  neon: {
    bg: "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900",
    card: "bg-gray-900/90 shadow-purple-500/30 backdrop-blur-xl",
    header: "bg-gray-950/80 border-purple-800/30",
    chat: "bg-gray-900/90",
    input: "bg-gray-800/90 border-purple-700/50 text-purple-100 placeholder-purple-500",
    codeBg: "bg-gray-800/90",
    button: "bg-purple-700/70 text-purple-200",
    sidebar: "bg-gray-900/95 border-purple-800/50 text-purple-200",
    sidebarHover: "hover:bg-purple-700/50",
  },
};

const LearnWithoutLimitsAI = () => {
  const [theme, setTheme] = useState("dark");
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animationState, setAnimationState] = useState("idle");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState({ topics: [] });
  const [showActions, setShowActions] = useState(false);

  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);
  const lottieRef = useRef(null);
  const presenterRef = useRef(null);
  const recognitionRef = useRef(null);
  const localStorageKey = "LearnWithoutLimitsChat";
  const historyStorageKey = "LearnWithoutLimitsHistory";
  const progressStorageKey = "LearnWithoutLimitsProgress";

  // Animation paths with fallback SVGs
  const animationPaths = {
    idle: {
      lottie: "https://assets5.lottiefiles.com/packages/lf20_5itoujzw.json",
      fallback: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#1e40af" />
          <path d="M30,40 Q50,60 70,40" stroke="#fff" strokeWidth="3" fill="none" />
          <circle cx="40" cy="35" r="5" fill="#fff" />
          <circle cx="60" cy="35" r="5" fill="#fff" />
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="5 50 50" dur="1s" repeatCount="indefinite" additive="sum" />
        </svg>
      ),
    },
    reading: {
      lottie: "https://assets5.lottiefiles.com/packages/lf20_ws4owbvr.json",
      fallback: (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <rect x="30" y="20" width="40" height="60" rx="5" fill="#1e40af" />
          <path d="M40,30 L60,30 M40,40 L60,40 M40,50 L60,50" stroke="#fff" strokeWidth="2" />
          <circle cx="50" cy="70" r="5" fill="#fff" />
          <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite" />
        </svg>
      ),
    },
  };

  useEffect(() => {
    const savedChat = localStorage.getItem(localStorageKey);
    if (savedChat) {
      try {
        setChatMessages(JSON.parse(savedChat));
      } catch (e) {
        console.error("Error loading chat:", e);
      }
    }
    const welcomeMessage = {
      id: Date.now(),
      text: "Welcome to Learn Without Limits AI. How can I assist you today?",
      className: "ai-message",
      code: null,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => setChatMessages([welcomeMessage]), 500);

    const savedProgress = localStorage.getItem(progressStorageKey);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (e) {
        console.error("Error loading progress:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(chatMessages));
    localStorage.setItem(progressStorageKey, JSON.stringify(progress));
  }, [chatMessages, progress]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(historyStorageKey);
    if (savedHistory) {
      try {
        setConversationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Error loading history:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [chatMessages, loading]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
      window.speechSynthesis?.cancel();
      if (recognitionRef.current) recognitionRef.current.stop();
      lottie.destroy();
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (lottieRef.current) {
      lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets10.lottiefiles.com/packages/lf20_wa2wvajb.json",
      });
    }
    return () => lottie.destroy();
  }, []);

  useEffect(() => {
    if (presenterRef.current) {
      lottie.destroy();
      const currentAnimation = animationPaths[animationState] || animationPaths.idle;

      try {
        const anim = lottie.loadAnimation({
          container: presenterRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: currentAnimation.lottie,
        });
        anim.addEventListener("DOMLoaded", () => console.log("Animation loaded successfully"));
        anim.addEventListener("loaderror", (e) => {
          console.error("Failed to load animation:", e);
          presenterRef.current.innerHTML = "";
          presenterRef.current.appendChild(currentAnimation.fallback);
        });
      } catch (error) {
        console.error("Lottie loading error:", error);
        presenterRef.current.innerHTML = "";
        presenterRef.current.appendChild(currentAnimation.fallback);
      }
    }
  }, [animationState]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : prev === "light" ? "neon" : "dark"));

  const appendMessage = useCallback(
    (text, className, code = null, isTyping = false) =>
      setChatMessages((prev) => [...prev.slice(-150), { id: Date.now(), text, className, code, timestamp: new Date().toISOString(), isTyping }]),
    []
  );

  const updateLastMessage = useCallback(
    (text, code = null, isTyping = false) =>
      setChatMessages((prev) => {
        const updated = [...prev];
        if (updated.length) {
          updated[updated.length - 1] = { ...updated[updated.length - 1], text, code, timestamp: new Date().toISOString(), isTyping };
        }
        return updated;
      }),
    []
  );

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => showToast("📋 Copied!")).catch(() => showToast("❌ Copy failed"));
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg animate-bounce`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const extractCodeFromText = (text) => {
    if (!text) return { code: null, text: "" };
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
    return { code: codeBlocks.length ? codeBlocks : null, text: remainingText.trim() || "" };
  };

  const mockAIResponse = async function* (prompt) {
    const responses = {
      hello: "Greetings! How can I assist you today?",
      code: "Here's a sample Python code snippet:\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n```",
    };
    const responseText = responses[prompt.toLowerCase()] || `You asked: ${prompt}. Here's a professional response to guide your learning.`;
    for (let i = 0; i < responseText.length; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      yield responseText.slice(0, i + 10);
    }
  };

  const generate = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setMessage("");
    setLoading(true);
    setAnimationState("reading");
    appendMessage(userMessage, "user-message");
    controllerRef.current = new AbortController();

    try {
      appendMessage("", "ai-message", null, true);
      const responseStream = mockAIResponse(userMessage);
      let fullText = "";
      for await (const chunk of responseStream) {
        fullText += chunk;
        updateLastMessage(fullText, null, true);
      }
      const { code, text } = extractCodeFromText(fullText);
      updateLastMessage(text, code);
      setProgress((prev) => ({ ...prev, topics: [...new Set([...prev.topics, userMessage.toLowerCase()])] }));
    } catch (error) {
      if (error.name === "AbortError") updateLastMessage("[Stopped]");
      else appendMessage("⚠️ An error occurred. Please try again.", "ai-message");
    } finally {
      setLoading(false);
      setAnimationState("idle");
      controllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setLoading(false);
      updateLastMessage("[Stopped]");
      setAnimationState("idle");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      loading ? stopGeneration() : generate();
    }
  };

  const speakMessage = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAnimationState("idle");
      return;
    }
    const success = speakText(
      text,
      () => {
        setIsSpeaking(true);
        setAnimationState("reading");
      },
      () => {
        setIsSpeaking(false);
        setAnimationState("idle");
      }
    );
    if (!success) showToast("❌ Speech failed");
  };

  const saveConversation = () => {
    const item = {
      id: Date.now(),
      title: message.slice(0, 50) || chatMessages[chatMessages.length - 1]?.text.slice(0, 50) || "Chat",
      messages: chatMessages,
      timestamp: new Date().toISOString(),
    };
    setConversationHistory((prev) => {
      const updated = [...prev, item];
      localStorage.setItem(historyStorageKey, JSON.stringify(updated));
      return updated;
    });
    showToast("💾 Saved!");
  };

  const loadConversation = (item) => {
    setChatMessages(item.messages);
    setShowSidebar(false);
    showToast("📂 Loaded!");
  };

  const deleteConversation = (id) => {
    setConversationHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(historyStorageKey, JSON.stringify(updated));
      return updated;
    });
    showToast("🗑️ Deleted!");
  };

  const exportAsPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = chatMessages
      .map(
        (msg) =>
          `<div><strong>${msg.className === "user-message" ? "You" : "AI"} (${new Date(msg.timestamp).toLocaleString()}):</strong><p>${
            msg.text
          }</p>${msg.code ? msg.code.map((c) => `<pre>${c.code}</pre>`).join("") : ""}</div>`
      )
      .join("");
    window.html2pdf().from(element).set({ filename: `LearnWithoutLimits_${Date.now()}.pdf`, margin: 10, jsPDF: { unit: "mm", format: "a4" } }).save();
    showToast("📄 Exported!");
  };

  const startVoiceInput = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      showToast("❌ Speech recognition not supported");
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = true;
    recognitionRef.current.onresult = (event) =>
      setMessage(Array.from(event.results).map((result) => result[0].transcript).join(""));
    recognitionRef.current.onend = () => setIsRecording(false);
    recognitionRef.current.onerror = (event) => {
      console.error("Speech error:", event);
      showToast("❌ Speech failed");
      setIsRecording(false);
    };
    recognitionRef.current.start();
    setIsRecording(true);
  };

  const stopVoiceInput = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Display prompt with animation
  const displayPromptWithAnimation = (prompt) => {
    if (prompt.trim()) {
      setAnimationState("reading");
    } else {
      setAnimationState("idle");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center p-4 ${themes[theme].bg} transition-colors duration-500 font-sans`}
      style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}
    >
      <style>{`
        @keyframes pulse-glow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5)); } 50% { filter: drop-shadow(0 0 16px rgba(59, 130, 246, 0.8)); } }
        .glow { animation: pulse-glow 2s ease-in-out infinite; }
        .presenter-glow { animation: pulse-glow 2s ease-in-out infinite; filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.7)); }
        .professional-bg { background: linear-gradient(135deg, #111827, #1f2937); }
        textarea::-webkit-scrollbar { display: none; }
        textarea { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <div className="w-full max-w-screen-xl flex justify-center">
        <AnimatePresence>
          {showSidebar && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
              className={`w-64 sm:w-80 h-[85vh] sm:h-[90vh] rounded-2xl mr-4 ${themes[theme].sidebar} backdrop-blur-xl overflow-y-auto p-4 professional-bg`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-white">History</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowSidebar(false)}
                  className={`p-2 rounded-full ${themes[theme].button}`}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
              </div>
              <div className="mb-6">
                {conversationHistory.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span
                      className={`cursor-pointer ${themes[theme].sidebarHover} rounded px-2 text-white text-sm`}
                      onClick={() => loadConversation(item)}
                    >
                      {item.title} ({new Date(item.timestamp).toLocaleDateString()})
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteConversation(item.id)}
                      className="p-1 rounded-full bg-red-500/70 text-white"
                    >
                      <Trash className="w-4 h-4" />
                    </motion.button>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-white">Settings</h3>
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={toggleTheme}
                    className={`flex items-center p-2 rounded-md ${themes[theme].button} ${themes[theme].sidebarHover}`}
                  >
                    <Palette className="w-4 h-4 mr-2 text-white" /> Theme
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`w-full max-w-[90vw] sm:max-w-4xl rounded-3xl shadow-2xl overflow-hidden ${themes[theme].card} h-[85vh] sm:h-[90vh] professional-bg`}
        >
          <header className={`flex items-center justify-between p-4 sm:p-5 ${themes[theme].header} backdrop-blur-xl border-b border-gray-800/30`}>
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSidebar(!showSidebar)}
                className={`p-2 sm:p-3 rounded-full ${themes[theme].button}`}
              >
                <Menu className="w-5 h-5 text-white" />
              </motion.button>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg"
              >
                🤖
              </motion.div>
              <motion.h1
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400"
              >
                Learn Without Limits AI
              </motion.h1>
            </div>
          </header>

          <div className="flex flex-col h-[calc(85vh-72px)] sm:h-[calc(90vh-80px)]">
            <div ref={chatContainerRef} className={`flex-grow overflow-y-auto p-6 ${themes[theme].chat} overscroll-contain relative`}>
              <motion.div
                className="absolute right-4 bottom-4 w-32 h-32 glow"
                initial={{ x: 24 }}
                animate={{ x: animationState === "idle" ? 5 : 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                ref={lottieRef}
              ></motion.div>
              <motion.div
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-64 h-64 rounded-lg overflow-hidden presenter-glow z-10"
                ref={presenterRef}
                style={{ backgroundColor: "transparent" }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  {animationState === "idle" && <div className="text-white text-center">Loading animation...</div>}
                </div>
              </motion.div>
              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    className={`mb-4 flex ${msg.className === "user-message" ? "justify-end" : "justify-start"} items-end max-w-[80%]`}
                  >
                    {msg.className === "ai-message" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold mr-3 shrink-0">
                        AI
                      </div>
                    )}
                    <div className="flex flex-col max-w-full">
                      {msg.text && (
                        <div
                          className={`p-4 rounded-2xl ${
                            msg.className === "user-message"
                              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                              : "bg-gray-800/90 text-gray-200 shadow-gray-900/30"
                          } text-base whitespace-pre-wrap ${msg.isTyping ? "animate-pulse" : ""}`}
                        >
                          {msg.text}
                          {msg.className === "ai-message" && (
                            <div className="mt-2 flex space-x-2">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => speakMessage(msg.text)}
                                className="p-1 text-xs opacity-70 hover:opacity-100"
                              >
                                <Volume2 className="w-4 h-4 text-white" />
                              </motion.button>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.code &&
                        msg.code.map(({ language, code }, i) => (
                          <div key={i} className={`mt-2 p-3 rounded-xl ${themes[theme].codeBg} relative`}>
                            <SyntaxHighlighter
                              language={language}
                              style={theme === "dark" || theme === "neon" ? oneDark : oneLight}
                              customStyle={{ fontSize: "0.875rem", margin: 0, padding: "0.5rem" }}
                              showLineNumbers
                            >
                              {code}
                            </SyntaxHighlighter>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => copyToClipboard(code)}
                              className="bg-gray-600/50 text-gray-200 absolute top-2 right-2 p-1.5 rounded-md hover:bg-indigo-500/20"
                            >
                              <Copy className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                    </div>
                    {msg.className === "user-message" && (
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold ml-3 shrink-0">
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
                  className="flex items-center text-sm text-gray-400 mt-4 ml-14 max-w-[80%]"
                >
                  <div className="flex space-x-1 mr-2">
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2 }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-indigo-400"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }}
                      className="w-2 h-2 rounded-full bg-purple-400"
                    />
                  </div>
                  Processing...
                </motion.div>
              )}
            </div>

            <div className={`p-6 ${themes[theme].header} backdrop-blur-xl border-t border-gray-800/30 flex flex-col items-center`}>
              <div className="flex items-center space-x-3 w-full max-w-2xl">
                <motion.textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    displayPromptWithAnimation(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  className={`flex-grow p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${themes[theme].input} text-base bg-gray-800/90 text-white placeholder-gray-500`}
                  placeholder="Ask anything..."
                  style={{ minHeight: "50px", maxHeight: "150px" }}
                  whileFocus={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={loading ? stopGeneration : generate}
                  className={`p-4 rounded-xl font-semibold shadow-lg flex items-center justify-center min-w-[100px] ${
                    loading
                      ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-blue-500/20"
                  }`}
                >
                  {loading ? (
                    <>
                      <Square className="w-5 h-5 mr-2" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send
                    </>
                  )}
                </motion.button>
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowActions(!showActions)}
                    className={`p-4 rounded-xl ${themes[theme].button}`}
                  >
                    <ChevronDown className="w-5 h-5 text-white" />
                  </motion.button>
                  <AnimatePresence>
                    {showActions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className={`absolute bottom-full right-0 mb-2 p-2 rounded-xl ${themes[theme].card} shadow-lg flex flex-col space-y-2 bg-gray-800/90 text-white`}
                      >
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => speakMessage(message || chatMessages[chatMessages.length - 1]?.text)}
                          className={`flex items-center p-2 rounded-md ${themes[theme].button}`}
                        >
                          <Volume2 className="w-4 h-4 mr-2 text-white" /> Speak
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={isRecording ? stopVoiceInput : startVoiceInput}
                          className={`flex items-center p-2 rounded-md ${isRecording ? "bg-red-500/70 text-red-200" : themes[theme].button}`}
                        >
                          <Mic className="w-4 h-4 mr-2 text-white" /> {isRecording ? "Stop" : "Voice"}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={saveConversation}
                          className={`flex items-center p-2 rounded-md ${themes[theme].button}`}
                        >
                          <Save className="w-4 h-4 mr-2 text-white" /> Save
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={exportAsPDF}
                          className={`flex items-center p-2 rounded-md ${themes[theme].button}`}
                        >
                          <Download className="w-4 h-4 mr-2 text-white" /> Export
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <div className="mt-2 text-xs text-center text-gray-400">Powered by AI</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnWithoutLimitsAI;