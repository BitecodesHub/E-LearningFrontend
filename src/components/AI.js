import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Menu, X, Send, Square, Volume2, Save, Trash, Palette, Mic, ChevronDown, Code } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

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
  utterance.onerror = (event) => {
    console.error("Speech error:", event);
    if (onEnd) onEnd();
  };
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
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState({ topics: [] });
  const [showActions, setShowActions] = useState(false);
  const [streamingState, setStreamingState] = useState({
    tempText: "",
    currentCodeBlock: "",
    codeLanguage: "",
    isInCodeBlock: false,
  });
  const [showCodeSections, setShowCodeSections] = useState({});

  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const localStorageKey = "LearnWithoutLimitsChat";
  const historyStorageKey = "LearnWithoutLimitsHistory";
  const progressStorageKey = "LearnWithoutLimitsProgress";

  useEffect(() => {
    const savedChat = localStorage.getItem(localStorageKey);
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        setChatMessages(parsedChat);
  
        const initialCodeSections = {};
        parsedChat.forEach((msg) => {
          if (msg.code && msg.code.length > 0) {
            initialCodeSections[msg.id] = true;
          }
        });
        setShowCodeSections(initialCodeSections);
      } catch (e) {
        console.error("Error loading chat:", e);
      }
    }
  
    // Load saved code section toggle states
    const savedCodeSections = localStorage.getItem("CodeSectionStates");
    if (savedCodeSections) {
      try {
        setShowCodeSections(JSON.parse(savedCodeSections));
      } catch (e) {
        console.error("Error loading code section states:", e);
      }
    }
  
    const welcomeMessage = {
      id: Date.now(),
      text: "Welcome to Learn Without Limits AI. How can I assist you today?",
      className: "ai-message",
      code: null,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => {
      setChatMessages((prev) => (prev.length === 0 ? [welcomeMessage] : prev));
      setShowCodeSections((prev) => ({ ...prev, [welcomeMessage.id]: false }));
    }, 500);
  
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
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [message]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : prev === "light" ? "neon" : "dark"));

  const appendMessage = useCallback(
    (text, className, code = null, isTyping = false) => {
      const newMessage = {
        id: Date.now(),
        text,
        className,
        code,
        timestamp: new Date().toISOString(),
        isTyping,
      };

      setChatMessages((prev) => {
        const newMessages = [...prev.slice(-150), newMessage];
        return newMessages;
      });

      setShowCodeSections((prev) => ({
        ...prev,
        [newMessage.id]: code && code.length > 0 ? true : false,
      }));
    },
    []
  );

  const updateLastMessage = useCallback(
    (text, code = null, isTyping = false) => {
      setChatMessages((prev) => {
        if (!prev.length) return prev;
        const updated = [...prev];
        const lastMessage = updated[updated.length - 1];
        const updatedMessage = {
          ...lastMessage,
          text,
          code,
          timestamp: new Date().toISOString(),
          isTyping,
        };
        updated[updated.length - 1] = updatedMessage;

        setShowCodeSections((prevSections) => ({
          ...prevSections,
          [updatedMessage.id]: code && code.length > 0 ? true : prevSections[updatedMessage.id] || false,
        }));

        return updated;
      });
    },
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

  // Replace the extractCodeFromText function with this improved version
        const extractCodeFromText = (text) => {
          if (!text) return { code: null, text: "" };
          
          // Modified regex to properly capture language and code content
          const codeBlockRegex = /```([\w]*)\n?([\s\S]*?)\n```/g;
          const codeBlocks = [];
          let lastIndex = 0;
          let match;
          let remainingText = "";
        
          while ((match = codeBlockRegex.exec(text)) !== null) {
            // Get language (default to plaintext if not specified)
            const language = match[1].trim() || "plaintext";
            // Get code content directly
            const code = match[2].trim();
            
            codeBlocks.push({ language, code });
            remainingText += text.slice(lastIndex, match.index);
            lastIndex = codeBlockRegex.lastIndex;
          }
          remainingText += text.slice(lastIndex);
        
          return {
            code: codeBlocks.length ? codeBlocks : null,
            text: remainingText.trim() || text,
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response error:", errorText);
        throw new Error("Failed to fetch response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      appendMessage("", "ai-message", null, true);

      // Replace the "while" loop in your generate function with this fixed version:

while (true) {
  const { done, value } = await reader.read();
  if (done) {
    // Ensure any remaining code block is properly closed and processed
    setStreamingState(prevState => {
      const { tempText, currentCodeBlock, codeLanguage, isInCodeBlock } = prevState;
      
      // Create final message content with proper code formatting
      const finalText = tempText + 
        (isInCodeBlock ? 
          `\`\`\`${codeLanguage}\n${currentCodeBlock}\n\`\`\`` : 
          "");
      
      const { code, text } = extractCodeFromText(finalText);
      
      // Update with finalized content
      updateLastMessage(text, code, false);
      
      // Save the final state to localStorage to ensure persistence
      setChatMessages(currentMessages => {
        const updatedMessages = currentMessages.map(msg => 
          msg.isTyping ? { ...msg, isTyping: false } : msg
        );
        localStorage.setItem(localStorageKey, JSON.stringify(updatedMessages));
        return updatedMessages;
      });
      
      return { tempText: "", currentCodeBlock: "", codeLanguage: "", isInCodeBlock: false };
    });
    
    break;
  }
  
  const chunk = decoder.decode(value, { stream: true });
  chunk.split("\n").forEach((line) => {
    if (line.startsWith("data: ")) {
      try {
        const json = JSON.parse(line.replace("data: ", "").trim());
        if (json && json.response) {
          const text = json.response;
          setStreamingState((prev) => {
            let { tempText, currentCodeBlock, codeLanguage, isInCodeBlock } = prev;
          
            // Check for code block markers
            if (text.includes("```")) {
              const parts = text.split("```");
              
              if (isInCodeBlock) {
                // We're in a code block and found a closing marker
                isInCodeBlock = false;
                currentCodeBlock += parts[0]; // Add text before closing marker
                
                // Create proper code block format without including language as part of code
                const { code, text: extractedText } = extractCodeFromText(
                  `\`\`\`${codeLanguage}\n${currentCodeBlock}\n\`\`\``
                );
                tempText += extractedText;
                updateLastMessage(tempText, code, true);
                
                // Handle any text after the code block
                const afterCode = parts.slice(1).join("```");
                if (afterCode) tempText += afterCode;
                
                currentCodeBlock = "";
                codeLanguage = "";
              } else if (parts.length > 1) {
                // We're not in a code block and found an opening marker
                isInCodeBlock = true;
                tempText += parts[0]; // Add text before opening marker
                
                // Extract language properly
                // Look for language identifier at the start of the code block
                const langMatch = parts[1].match(/^(\w+)\n?/);
                codeLanguage = langMatch ? langMatch[1] : "plaintext";
                
                // Remove language identifier from the code content
                if (langMatch) {
                  currentCodeBlock = parts[1].substring(langMatch[0].length);
                } else {
                  currentCodeBlock = parts[1];
                }
              }
            } else if (isInCodeBlock) {
              // We're in a code block, add content to current code block
              currentCodeBlock += text;
              const tempCode = [
                {
                  language: codeLanguage || "plaintext",
                  code: currentCodeBlock,
                },
              ];
              updateLastMessage(tempText, tempCode, true);
            } else {
              // Regular text processing
              tempText += text;
              updateLastMessage(tempText, null, true);
            }
          
            return { tempText, currentCodeBlock, codeLanguage, isInCodeBlock };
          });
          
        }
      } catch (e) {
        console.error("JSON parse error:", e, "Line:", line);
      }
    }
  });
}
      
    } catch (error) {
      console.error("Generate error:", error);
      if (error.name === "AbortError") {
        const { code, text } = extractCodeFromText(
          streamingState.tempText +
            (streamingState.isInCodeBlock ? `\n\`\`\`${streamingState.codeLanguage}\n${streamingState.currentCodeBlock}\n\`\`\`` : "")
        );
        updateLastMessage(text, code, false);
      } else {
        appendMessage("⚠️ An error occurred. Please try again.", "ai-message");
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
      return;
    }
    const success = speakText(
      text,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
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
    const initialCodeSections = {};
    item.messages.forEach((msg) => {
      if (msg.code && msg.code.length > 0) {
        initialCodeSections[msg.id] = true;
      } else {
        initialCodeSections[msg.id] = false;
      }
    });
    setShowCodeSections(initialCodeSections);
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

  const toggleCodeSection = (messageId) => {
    setShowCodeSections((prev) => {
      const newState = {
        ...prev,
        [messageId]: !prev[messageId]
      };
      // Force update message storage to ensure toggle state persists
      localStorage.setItem("CodeSectionStates", JSON.stringify(newState));
      return newState;
    });
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
        .professional-bg { background: linear-gradient(135deg, #111827, #1f2937); }
        textarea::-webkit-scrollbar { display: none; }
        textarea { scrollbar-width: none; -ms-overflow-style: none; }
        .code-section { max-height: 300px; overflow-y: auto; }
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
              <AnimatePresence>
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mb-4 flex ${msg.className === "user-message" ? "justify-end" : "justify-start"} items-end max-w-[80%] ${msg.className === "user-message" ? "ml-auto" : "mr-auto"}`}
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
                      {msg.code && msg.code.length > 0 && (
                <div className="mt-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleCodeSection(msg.id)}
                    className={`flex items-center p-2 rounded-md ${themes[theme].button}`}
                  >
                    <Code className="w-4 h-4 mr-2 text-white" />
                    {showCodeSections[msg.id] ? "Hide Code" : "Show Code"}
                  </motion.button>
                  
                  <AnimatePresence>
                    {showCodeSections[msg.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`mt-2 p-3 rounded-xl ${themes[theme].codeBg} code-section relative`}
                      >
                        {msg.code.map(({ language, code }, i) => {
                          // Critical fix: Make sure language is processed correctly
                          const displayLanguage = language ? language.trim() : "plaintext";
                          
                          // Critical fix: Clean the code content to remove any language prefix
                          // This ensures the language identifier isn't showing up as first line
                          const cleanedCode = code.replace(new RegExp(`^${displayLanguage}\\s*`), '');
                          
                          return (
                            <div key={i} className="relative mb-2">
                              <div className="font-bold text-sm text-gray-300">
                                {displayLanguage.toUpperCase()}
                              </div>
                              <SyntaxHighlighter
                                language={displayLanguage}
                                style={theme === "dark" || theme === "neon" ? oneDark : oneLight}
                                customStyle={{ fontSize: "0.875rem", margin: 0, padding: "0.5rem" }}
                                showLineNumbers
                              >
                                {cleanedCode}
                              </SyntaxHighlighter>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => copyToClipboard(cleanedCode)}
                                className="absolute top-2 right-2 p-1 bg-gray-800/70 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/70"
                              >
                                <Copy className="w-4 h-4" />
                              </motion.button>
                            </div>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                        </div>
                      )}
                    </div>
                    {msg.className === "user-message" && (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center text-white text-sm font-bold ml-3 shrink-0">
                        You
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              {loading && chatMessages.length && !chatMessages[chatMessages.length - 1].isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center items-center py-4"
                >
                  <div className="w-6 h-6 rounded-full glow bg-blue-500 animate-pulse"></div>
                </motion.div>
              )}
            </div>

            <div className={`p-4 relative border-t ${themes[theme].header} backdrop-blur-xl border-gray-800/30`}>
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything..."
                  className={`w-full p-4 pr-36 rounded-xl resize-none ${themes[theme].input} transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/70`}
                  style={{ minHeight: "60px", maxHeight: "150px" }}
                ></textarea>
                <div className="absolute right-2 bottom-2 flex space-x-2">
                  {isRecording ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={stopVoiceInput}
                      className="p-2 rounded-full bg-red-500 text-white"
                    >
                      <Square className="w-5 h-5" />
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={startVoiceInput}
                      className={`p-2 rounded-full ${themes[theme].button}`}
                    >
                      <Mic className="w-5 h-5 text-white" />
                    </motion.button>
                  )}

                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowActions(!showActions)}
                      className={`p-2 rounded-full ${themes[theme].button}`}
                    >
                      <ChevronDown className={`w-5 h-5 text-white transition-all duration-300 ${showActions ? "transform rotate-180" : ""}`} />
                    </motion.button>
                    <AnimatePresence>
                      {showActions && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className={`absolute bottom-full right-0 mb-2 p-2 rounded-lg ${themes[theme].sidebar} shadow-lg z-10 backdrop-blur-xl`}
                        >
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveConversation}
                            className={`p-2 flex items-center justify-center ${themes[theme].button} mb-2 w-full rounded-md`}
                          >
                            <Save className="w-4 h-4 mr-2 text-white" />
                            <span className="text-white text-sm">Save Chat</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              localStorage.removeItem(localStorageKey);
                              setChatMessages([]);
                              setShowCodeSections({});
                              showToast("🧹 Cleared chat!");
                            }}
                            className={`p-2 flex items-center justify-center bg-red-500/70 w-full rounded-md`}
                          >
                            <Trash className="w-4 h-4 mr-2 text-white" />
                            <span className="text-white text-sm">Clear Chat</span>
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => (loading ? stopGeneration() : generate())}
                    className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                  >
                    {loading ? <Square className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LearnWithoutLimitsAI;