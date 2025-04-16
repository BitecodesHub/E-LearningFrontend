import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy, Menu, X, Send, Square, Volume2, Save, Trash, Download, Palette,
  Mic, BookOpen, Languages, Sparkles, Heart, Star, BarChart, ChevronDown
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import lottie from "lottie-web";

// Note: Include these dependencies in your project:
// - html2pdf.js for PDF export
// - lodash for debouncing utilities (optional)

const detectLanguage = (code) => {
  if (!code || typeof code !== "string") return "plaintext";
  if (code.includes("public class") || code.includes("private void")) return "java";
  if (code.includes("def ") || code.includes("print(") || code.includes("import numpy")) return "python";
  if (code.includes("console.log") || code.includes("function ") || code.includes("const ") || code.includes("let ")) return "javascript";
  if (code.includes("#include") || code.includes("int main(")) return "cpp";
  if (code.includes("<html") || code.includes("<!DOCTYPE")) return "html";
  if (code.includes("SELECT ") && code.includes(" FROM ")) return "sql";
  if (code.includes("using namespace") || code.includes("std::")) return "cpp";
  if (code.includes("package ") || code.includes("func ") || code.includes("fmt.")) return "go";
  return "plaintext";
};

const speakText = (text, voice, rate, onStart, onEnd) => {
  if (!window.speechSynthesis) {
    console.error("Text-to-speech not supported");
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "Code block omitted for speech.")
      .replace(/[^\w\s.,?!;:'"()\-\u0080-\uFFFF]/g, "");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.voice = voice || window.speechSynthesis.getVoices()[0];
    utterance.lang = "en-US";
    utterance.rate = rate || 1;
    utterance.pitch = 1;
    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      if (onEnd) onEnd();
    };
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (error) {
    console.error("Speech synthesis error:", error);
    return false;
  }
};

const themes = {
  dark: {
    bg: "bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-900",
    card: "bg-gray-800/80 shadow-indigo-500/30 backdrop-blur-lg",
    header: "bg-gray-850/50 border-gray-700/20",
    chat: "bg-gray-900/50",
    input: "bg-gray-700/70 border-gray-600/50 text-gray-100 placeholder-gray-400",
    codeBg: "bg-gray-700/70",
    button: "bg-gray-700/50 text-gray-300",
    sidebar: "bg-gray-800/90 border-gray-700/50",
  },
  light: {
    bg: "bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-100",
    card: "bg-white/80 shadow-blue-300/50 backdrop-blur-lg",
    header: "bg-white/50 border-gray-200/20",
    chat: "bg-gray-50/50",
    input: "bg-gray-50/70 border-gray-300/50 text-gray-900 placeholder-gray-500",
    codeBg: "bg-gray-100/70",
    button: "bg-gray-200/50 text-gray-700",
    sidebar: "bg-white/90 border-gray-200/50",
  },
  neon: {
    bg: "bg-gradient-to-br from-pink-900 via-purple-900 to-blue-900",
    card: "bg-gray-900/80 shadow-pink-500/30 backdrop-blur-lg",
    header: "bg-gray-950/50 border-pink-700/20",
    chat: "bg-gray-900/50",
    input: "bg-gray-800/70 border-pink-600/50 text-pink-100 placeholder-pink-400",
    codeBg: "bg-gray-800/70",
    button: "bg-pink-700/50 text-pink-300",
    sidebar: "bg-gray-900/90 border-pink-700/50",
  },
};

const LearnWithoutLimitsAI = () => {
  const [theme, setTheme] = useState("dark");
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [streamingState, setStreamingState] = useState({
    tempText: "",
    currentCodeBlock: "",
    codeLanguage: "",
    isInCodeBlock: false,
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animationState, setAnimationState] = useState("idle");
  const [conversationHistory, setConversationHistory] = useState([]);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speechRate, setSpeechRate] = useState(1);
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [messageReactions, setMessageReactions] = useState({});
  const [topicSuggestions, setTopicSuggestions] = useState([]);
  const [progress, setProgress] = useState({ topics: [], quizzes: [] });
  const [showActions, setShowActions] = useState(false);
  const [mode, setMode] = useState("chat");

  const chatContainerRef = useRef(null);
  const controllerRef = useRef(null);
  const textareaRef = useRef(null);
  const lottieRef = useRef(null);
  const recognitionRef = useRef(null);
  const localStorageKey = "LearnWithoutLimitsChat";
  const historyStorageKey = "LearnWithoutLimitsHistory";
  const progressStorageKey = "LearnWithoutLimitsProgress";

  useEffect(() => {
    const savedChat = localStorage.getItem(localStorageKey);
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat);
        if (Array.isArray(parsedChat) && parsedChat.length > 0) {
          setChatMessages(parsedChat);
          return;
        }
      } catch (error) {
        console.error("Error loading saved chat:", error);
      }
    }

    const welcomeMessage = {
      id: Date.now(),
      text: "🌌 Greetings, knowledge seeker! I'm your AI guide to mastering any subject. What's sparking your curiosity today?",
      className: "ai-message",
      code: null,
      timestamp: new Date().toISOString(),
    };
    setTimeout(() => {
      setChatMessages([welcomeMessage]);
      setSuggestions(["Tell me about AI", "Show me some code", "Start a quiz"]);
    }, 500);

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) setSelectedVoice(availableVoices[0]);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    const savedProgress = localStorage.getItem(progressStorageKey);
    if (savedProgress) {
      try {
        const parsedProgress = JSON.parse(savedProgress);
        setProgress(parsedProgress);
      } catch (error) {
        console.error("Error loading progress:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (chatMessages.length > 0) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(chatMessages));
      } catch (error) {
        console.error("Error saving chat to localStorage:", error);
      }
    }
    try {
      localStorage.setItem(progressStorageKey, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress to localStorage:", error);
    }
  }, [chatMessages, progress]);

  useEffect(() => {
    try {
      const savedHistoryStr = localStorage.getItem(historyStorageKey);
      if (savedHistoryStr) {
        const savedHistory = JSON.parse(savedHistoryStr);
        if (Array.isArray(savedHistory)) {
          setConversationHistory(savedHistory);
        }
      }
    } catch (error) {
      console.error("Error loading conversation history:", error);
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
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
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [message]);

  useEffect(() => {
    if (lottieRef.current) {
      lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "https://assets.lottiefiles.com/packages/lf20_jzqkwrgp.json",
      });
    }
    return () => lottie.destroy();
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottie.destroy();
      const animationPaths = {
        idle: "https://assets.lottiefiles.com/packages/lf20_jzqkwrgp.json",
        speaking: "https://assets.lottiefiles.com/packages/lf20_klsm3gvq.json",
        happy: "https://assets.lottiefiles.com/packages/lf20_3yx6fkyo.json",
        thinking: "https://assets.lottiefiles.com/packages/lf20_ukr4bkzg.json",
        confused: "https://assets.lottiefiles.com/packages/lf20_fahmizgd.json",
      };
      lottie.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: animationPaths[animationState] || animationPaths.idle,
      }).addEventListener("loaderror", () => {
        console.error("Failed to load Lottie animation");
        setAnimationState("idle");
      });
    }
  }, [animationState]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : prev === "light" ? "neon" : "dark";
      return next;
    });
  };

  const appendMessage = useCallback((text, className, code = null, isTyping = false) => {
    const timestamp = new Date().toISOString();
    setChatMessages((prev) => {
      const newMessage = { id: Date.now(), text, className, code, timestamp, isTyping };
      return [...prev.slice(-150), newMessage];
    });
  }, []);

  const updateLastMessage = useCallback((text, code = null, isTyping = false) => {
    setChatMessages((prev) => {
      const updatedMessages = [...prev];
      if (updatedMessages.length === 0) return prev;
      updatedMessages[updatedMessages.length - 1] = {
        ...updatedMessages[updatedMessages.length - 1],
        text,
        code,
        timestamp: new Date().toISOString(),
        isTyping,
      };
      return updatedMessages;
    });
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Code copied!");
    }).catch((err) => {
      console.error("Failed to copy:", err);
      showToast("❌ Failed to copy code");
    });
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg z-50 transition-transform transform scale-100 opacity-100 animate-bounce`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("scale-0", "opacity-0");
      toast.classList.remove("opacity-100");
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
    return {
      code: codeBlocks.length ? codeBlocks : null,
      text: remainingText.trim() || "",
    };
  };

  const mockAIResponse = async function* (prompt) {
    const responses = {
      "hello": "Hello! How can I assist you today?",
      "code example": "Here's a Python example:\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n```",
      "quiz": "Let's create a quiz! Here's a question: What is 2+2?\nA) 3\nB) 4\nC) 5\nD) 6",
      "ai": "Artificial Intelligence is the simulation of human intelligence in machines. Learn more: [Intro to AI](https://www.coursera.org/learn/introduction-to-ai). Want to dive deeper?",
    };
    const responseText = responses[prompt.toLowerCase()] || `You asked: ${prompt}. Here's a sample response!`;
    for (let i = 0; i < responseText.length; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      yield responseText.slice(0, i + 10);
    }
  };

  const suggestTopics = (prompt) => {
    const suggestions = {
      ai: ["Machine Learning", "Neural Networks", "Natural Language Processing"],
      python: ["Data Science", "Web Development", "Automation"],
      javascript: ["React", "Node.js", "Web APIs"],
    };
    return suggestions[prompt.toLowerCase()] || [];
  };

  const generate = async () => {
    if (!message.trim()) return;
    const userMessage = message;
    setMessage("");
    setLoading(true);
    setAnimationState("thinking");
    appendMessage(userMessage, "user-message");

    controllerRef.current = new AbortController();
    setStreamingState({
      tempText: "",
      currentCodeBlock: "",
      codeLanguage: "",
      isInCodeBlock: false,
    });

    try {
      appendMessage("", "ai-message", null, true);
      const responseStream = mockAIResponse(userMessage);
      let fullText = "";
      for await (const chunk of responseStream) {
        fullText += chunk;
        setTypingText(fullText);
        const { code, text } = extractCodeFromText(fullText);
        updateLastMessage(text, code, true);
      }
      const { code, text } = extractCodeFromText(fullText);
      updateLastMessage(text, code);
      setSuggestions([
        text.includes("code") ? "Show another code example" : "Tell me more",
        "Start a quiz",
        "Translate this",
      ]);
      const newTopics = suggestTopics(userMessage);
      setTopicSuggestions(newTopics);
      if (newTopics.length > 0) {
        setProgress((prev) => ({
          ...prev,
          topics: [...new Set([...prev.topics, userMessage.toLowerCase()])],
        }));
      }
      if (userMessage.toLowerCase().includes("quiz")) {
        setQuizMode(true);
        setMode("quiz");
        setQuizQuestions([
          {
            question: "What is 2+2?",
            options: ["3", "4", "5", "6"],
            correct: "4",
          },
        ]);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        updateLastMessage(streamingState.tempText + "\n[Stopped by user]");
      } else {
        appendMessage("⚠️ Oops, something went wrong! Please try again.", "ai-message");
      }
    } finally {
      setLoading(false);
      setAnimationState("idle");
      controllerRef.current = null;
      setStreamingState({
        tempText: "",
        currentCodeBlock: "",
        codeLanguage: "",
        isInCodeBlock: false,
      });
      setTypingText("");
    }
  };

  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setLoading(false);
      updateLastMessage(streamingState.tempText + "\n[Stopped by user]");
      setAnimationState("idle");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (loading) stopGeneration();
      else generate();
    }
  };

  const speakMessage = (text) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setAnimationState("idle");
      return;
    }
    const cleanText = text.replace(/```[\s\S]*?```/g, "Code block omitted for speech.");
    const success = speakText(
      cleanText,
      selectedVoice,
      speechRate,
      () => {
        setIsSpeaking(true);
        setAnimationState("speaking");
      },
      () => {
        setIsSpeaking(false);
        setAnimationState("idle");
      }
    );
    if (!success) {
      showToast("❌ Text-to-speech failed");
      setAnimationState("idle");
    }
  };

  const saveConversation = () => {
    const historyItem = {
      id: Date.now(),
      title: message.slice(0, 50) || chatMessages[chatMessages.length - 1]?.text.slice(0, 50) || "Conversation",
      messages: chatMessages,
      timestamp: new Date().toISOString(),
    };
    setConversationHistory((prev) => {
      const updated = [...prev, historyItem];
      localStorage.setItem(historyStorageKey, JSON.stringify(updated));
      return updated;
    });
    showToast("💾 Conversation saved!");
  };

  const loadConversation = (historyItem) => {
    setChatMessages(historyItem.messages);
    setShowSidebar(false);
    showToast("📂 Conversation loaded!");
  };

  const deleteConversation = (id) => {
    setConversationHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem(historyStorageKey, JSON.stringify(updated));
      return updated;
    });
    showToast("🗑️ Conversation deleted!");
  };

  const exportAsPDF = () => {
    const element = document.createElement("div");
    element.innerHTML = chatMessages
      .map(
        (msg) => `
      <div style="margin-bottom: 16px;">
        <strong>${msg.className === "user-message" ? "You" : "AI"} (${new Date(msg.timestamp).toLocaleString()}):</strong>
        <p>${msg.text}</p>
        ${msg.code ? msg.code.map((c) => `<pre style="background: #f4f4f4; padding: 8px;">${c.code}</pre>`).join("") : ""}
      </div>
    `
      )
      .join("");
    window.html2pdf()
      .from(element)
      .set({
        filename: `LearnWithoutLimits_${Date.now()}.pdf`,
        margin: 10,
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
    showToast("📄 Chat exported as PDF!");
  };

  const translateMessage = async (text) => {
    try {
      const response = await fetch("https://libretranslate.com/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          source: "en",
          target: selectedLanguage,
          format: "text",
        }),
      });
      const data = await response.json();
      return data.translatedText;
    } catch (error) {
      console.error("Translation error:", error);
      showToast("❌ Translation failed");
      return text;
    }
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
    recognitionRef.current.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      setMessage(transcript);
    };
    recognitionRef.current.onend = () => {
      setIsRecording(false);
    };
    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event);
      showToast("❌ Speech recognition failed");
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

  const handleQuizAnswer = (questionIndex, answer) => {
    const question = quizQuestions[questionIndex];
    if (answer === question.correct) {
      showToast("🎉 Correct!");
      setAnimationState("happy");
      setProgress((prev) => ({
        ...prev,
        quizzes: [...prev.quizzes, { question: question.question, result: "correct" }],
      }));
      setTimeout(() => setAnimationState("idle"), 3000);
    } else {
      showToast("❌ Try again!");
      setAnimationState("confused");
      setProgress((prev) => ({
        ...prev,
        quizzes: [...prev.quizzes, { question: question.question, result: "incorrect" }],
      }));
      setTimeout(() => setAnimationState("idle"), 3000);
    }
  };

  const addReaction = (messageId, reaction) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: reaction,
    }));
  };

  const rateResponse = (messageId, rating) => {
    setMessageReactions((prev) => ({
      ...prev,
      [messageId]: { ...prev[messageId], rating },
    }));
    showToast(`⭐ Rated ${rating}/5!`);
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    generate();
  };

  const handleTopicSuggestionClick = (topic) => {
    setMessage(`Tell me about ${topic}`);
    generate();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex p-4 sm:p-6 ${themes[theme].bg} transition-colors duration-500 font-sans`}
    >
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% { filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5)); }
            50% { filter: drop-shadow(0 0 16px rgba(99, 102, 241, 0.8)); }
          }
          .glow { animation: pulse-glow 2s ease-in-out infinite; }
        `}
      </style>
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`w-64 sm:w-80 h-[85vh] sm:h-[90vh] rounded-2xl mr-4 ${themes[theme].sidebar} backdrop-blur-lg overflow-y-auto p-4`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Menu</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSidebar(false)}
                className={`p-2 rounded-full ${themes[theme].button}`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-2">Conversation History</h3>
              {conversationHistory.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <span
                    className="cursor-pointer hover:underline text-sm"
                    onClick={() => loadConversation(item)}
                  >
                    {item.title} ({new Date(item.timestamp).toLocaleDateString()})
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteConversation(item.id)}
                    className="p-1 rounded-full bg-red-500/50 text-white"
                  >
                    <Trash className="w-4 h-4" />
                  </motion.button>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-base font-semibold mb-2">Progress</h3>
              <p className="text-sm">Topics Covered: {progress.topics.length}</p>
              <p className="text-sm">Quizzes Completed: {progress.quizzes.length}</p>
              {progress.topics.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Recent Topics:</p>
                  <ul className="list-disc pl-4 text-sm">
                    {progress.topics.slice(-3).map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Settings</h3>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={toggleTheme}
                  className={`flex items-center p-2 rounded-md ${themes[theme].button} hover:bg-indigo-500/20`}
                >
                  <Palette className="w-4 h-4 mr-2" />
                  Change Theme
                </button>
                <select
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className={`p-2 rounded-md ${themes[theme].button}`}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
                <select
                  value={selectedLanguage}
                  onChange={async (e) => {
                    setSelectedLanguage(e.target.value);
                    if (chatMessages.length > 0) {
                      const lastMessage = chatMessages[chatMessages.length - 1];
                      if (lastMessage.text) {
                        const translated = await translateMessage(lastMessage.text);
                        updateLastMessage(translated, lastMessage.code);
                      }
                    }
                  }}
                  className={`p-2 rounded-md ${themes[theme].button}`}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`w-full max-w-[90vw] sm:max-w-4xl rounded-3xl shadow-2xl overflow-hidden ${themes[theme].card} h-[85vh] sm:h-[90vh]`}
      >
        <header
          className={`flex items-center justify-between p-4 sm:p-5 ${themes[theme].header} backdrop-blur-lg`}
        >
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-2 sm:p-3 rounded-full ${themes[theme].button} hover:bg-indigo-500/20 transition-colors`}
              aria-label="Toggle sidebar"
            >
              <Menu className="w-4 sm:w-5 h-4 sm:h-5" />
            </motion.button>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-base sm:text-lg"
            >
              🤖
            </motion.div>
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-xl sm:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
            >
              Learn Without Limits AI
            </motion.h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode("chat")}
                className={`px-3 py-1 rounded-full text-sm ${
                  mode === "chat"
                    ? "bg-indigo-500/50 text-indigo-200"
                    : themes[theme].button
                } hover:bg-indigo-500/20`}
              >
                Chat
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMode("quiz")}
                className={`px-3 py-1 rounded-full text-sm ${
                  mode === "quiz"
                    ? "bg-indigo-500/50 text-indigo-200"
                    : themes[theme].button
                } hover:bg-indigo-500/20`}
              >
                Quiz
              </motion.button>
            </div>
          </div>
        </header>

        <div className="flex flex-col h-[calc(85vh-72px)] sm:h-[calc(90vh-80px)]">
          <div
            ref={chatContainerRef}
            className={`flex-grow overflow-y-auto p-4 sm:p-6 ${themes[theme].chat} overscroll-contain relative`}
          >
            <motion.div
              className="absolute right-4 bottom-4 w-24 h-24 md:w-32 md:h-32 glow"
              initial={{ x: 24 }}
              animate={{ x: animationState === "idle" ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              ref={lottieRef}
            ></motion.div>
            <AnimatePresence>
              {topicSuggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-4 p-4 rounded-xl ${themes[theme].card} max-w-[80%]`}
                >
                  <h3 className="text-sm font-semibold mb-2">Explore More Topics:</h3>
                  <div className="flex flex-wrap gap-2">
                    {topicSuggestions.map((topic, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTopicSuggestionClick(topic)}
                        className={`px-3 py-1 rounded-full text-sm ${themes[theme].button} hover:bg-indigo-500/20`}
                      >
                        {topic}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`mb-4 flex ${
                    msg.className === "user-message" ? "justify-end" : "justify-start"
                  } items-end max-w-[80%]`}
                >
                  {msg.className === "ai-message" && (
                    <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold mr-2 sm:mr-3 shrink-0">
                      AI
                    </div>
                  )}
                  <div className="flex flex-col max-w-full">
                    {msg.text && (
                      <div
                        className={`p-3 sm:p-4 rounded-2xl ${
                          msg.className === "user-message"
                            ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20"
                            : theme === "dark"
                            ? "bg-gray-800/70 text-gray-200 shadow-gray-900/30"
                            : theme === "light"
                            ? "bg-white/70 text-gray-800 shadow-gray-200/30"
                            : "bg-gray-900/70 text-pink-200 shadow-pink-900/30"
                        } text-sm sm:text-base whitespace-pre-wrap ${
                          msg.isTyping ? "animate-pulse" : ""
                        }`}
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
                              <Volume2 className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => addReaction(msg.id, "❤️")}
                              className="p-1 text-xs opacity-70 hover:opacity-100"
                            >
                              {messageReactions[msg.id]?.reaction || "❤️"}
                            </motion.button>
                            <div className="flex space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.button
                                  key={star}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => rateResponse(msg.id, star)}
                                  className={`p-1 text-xs ${
                                    messageReactions[msg.id]?.rating >= star
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <Star className="w-4 h-4" />
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    {msg.code &&
                      msg.code.map(({ language, code }, index) => (
                        <div
                          key={index}
                          className={`mt-2 p-3 rounded-xl ${themes[theme].codeBg} relative`}
                        >
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
                            className={`absolute top-2 right-2 p-1.5 rounded-md ${
                              theme === "dark"
                                ? "bg-gray-600/50 text-gray-200"
                                : theme === "light"
                                ? "bg-gray-200/50 text-gray-800"
                                : "bg-pink-600/50 text-pink-200"
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
              {mode === "quiz" &&
                quizQuestions.map((q, index) => (
                  <motion.div
                    key={index}
                    className={`mb-4 p-4 rounded-xl ${themes[theme].card} max-w-[80%]`}
                  >
                    <p className="font-bold mb-2">{q.question}</p>
                    {q.options.map((option, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-md cursor-pointer hover:bg-indigo-500/10"
                        onClick={() => handleQuizAnswer(index, option)}
                      >
                        {option}
                      </div>
                    ))}
                  </motion.div>
                ))}
            </AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center text-sm text-gray-400 mt-4 ml-12 sm:ml-14 max-w-[80%]"
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

          <div className={`p-4 sm:p-6 ${themes[theme].header} backdrop-blur-lg`}>
            {suggestions.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === "dark"
                        ? "bg-gray-700/50 text-gray-300"
                        : theme === "light"
                        ? "bg-gray-200/50 text-gray-700"
                        : "bg-pink-700/50 text-pink-300"
                    } hover:bg-indigo-500/20`}
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            )}
            <div className="flex items-end space-x-2 sm:space-x-3">
              <motion.textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className={`flex-grow p-3 sm:p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all touch-manipulation ${themes[theme].input} text-sm sm:text-base`}
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
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowActions(!showActions)}
                  className={`p-3 sm:p-4 rounded-xl ${themes[theme].button} hover:bg-indigo-500/20 transition-colors`}
                >
                  <ChevronDown className="w-4 sm:w-5 h-4 sm:h-5" />
                </motion.button>
                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`absolute bottom-full right-0 mb-2 p-2 rounded-xl ${themes[theme].card} shadow-lg flex flex-col space-y-2`}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() =>
                          speakMessage(message || chatMessages[chatMessages.length - 1]?.text)
                        }
                        className={`flex items-center p-2 rounded-md ${themes[theme].button} hover:bg-indigo-500/20`}
                      >
                        <Volume2 className="w-4 h-4 mr-2" />
                        Speak
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={isRecording ? stopVoiceInput : startVoiceInput}
                        className={`flex items-center p-2 rounded-md ${
                          isRecording ? "bg-red-500/50 text-red-300" : themes[theme].button
                        } hover:bg-indigo-500/20`}
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        {isRecording ? "Stop Voice" : "Voice Input"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={saveConversation}
                        className={`flex items-center p-2 rounded-md ${themes[theme].button} hover:bg-indigo-500/20`}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={exportAsPDF}
                        className={`flex items-center p-2 rounded-md ${themes[theme].button} hover:bg-indigo-500/20`}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export PDF
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setQuizMode(!quizMode)}
                        className={`flex items-center p-2 rounded-md ${
                          quizMode ? "bg-indigo-500/50 text-indigo-300" : themes[theme].button
                        } hover:bg-indigo-500/20`}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {quizMode ? "Exit Quiz" : "Start Quiz"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-2 text-xs text-center text-gray-400">
              Powered by AI to unlock your learning potential
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LearnWithoutLimitsAI;