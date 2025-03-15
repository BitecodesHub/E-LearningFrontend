"use client";
import React, { useState, useEffect, useRef } from "react";
import { PlusCircle, X, Play, Copy, Save, Loader2, Code, FileCode, CheckCircle, ExternalLink, Image } from "lucide-react";
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { EditorView } from '@codemirror/view';
import CodeMirror from "@uiw/react-codemirror";
import { keymap } from "@codemirror/view";
import { autocompletion } from "@codemirror/autocomplete";

// Custom themes
const draculaTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#282a36', foreground: '#f8f8f2', caret: '#f8f8f2',
    selection: '#44475a', selectionMatch: '#44475a', lineHighlight: '#44475a30',
    gutterBackground: '#282a36', gutterForeground: '#6272a4',
  },
  styles: [
    { tag: t.comment, color: '#6272a4' },
    { tag: t.variableName, color: '#f8f8f2' },
    { tag: [t.string, t.special(t.brace)], color: '#f1fa8c' },
    { tag: t.number, color: '#bd93f9' },
    { tag: t.bool, color: '#bd93f9' },
    { tag: t.null, color: '#bd93f9' },
    { tag: t.keyword, color: '#ff79c6' },
    { tag: t.operator, color: '#ff79c6' },
    { tag: t.className, color: '#8be9fd' },
    { tag: t.definition(t.typeName), color: '#8be9fd' },
    { tag: t.typeName, color: '#8be9fd' },
    { tag: t.angleBracket, color: '#ff79c6' },
    { tag: t.tagName, color: '#ff79c6' },
    { tag: t.attributeName, color: '#50fa7b' },
  ],
});

const githubLightTheme = createTheme({
  theme: 'light',
  settings: {
    background: '#fff', foreground: '#24292e', caret: '#24292e',
    selection: '#d7d4f0', selectionMatch: '#d7d4f0', lineHighlight: '#f6f8fa',
    gutterBackground: '#fff', gutterForeground: '#6e7781',
  },
  styles: [
    { tag: t.comment, color: '#6a737d' },
    { tag: t.variableName, color: '#24292e' },
    { tag: [t.string, t.special(t.brace)], color: '#032f62' },
    { tag: t.number, color: '#005cc5' },
    { tag: t.bool, color: '#005cc5' },
    { tag: t.null, color: '#005cc5' },
    { tag: t.keyword, color: '#d73a49' },
    { tag: t.operator, color: '#d73a49' },
    { tag: t.className, color: '#6f42c1' },
    { tag: t.definition(t.typeName), color: '#6f42c1' },
    { tag: t.typeName, color: '#6f42c1' },
    { tag: t.angleBracket, color: '#d73a49' },
    { tag: t.tagName, color: '#22863a' },
    { tag: t.attributeName, color: '#6f42c1' },
  ],
});

const boilerplates = {
  javascript: "console.log('Hello World!');\n",
  python: "print('Hello World!')\n",
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello World!\\n");\n    return 0;\n}\n`,
  cpp: `#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello World!" << endl;\n    return 0;\n}\n`,
  html: `<!DOCTYPE html>\n<html>\n<head>\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>`,
  css: `body {\n    margin: 0;\n    padding: 20px;\n}`,
};

const visualizationImages = {
  javascript: "/api/placeholder/400/300",
  python: "/api/placeholder/400/300",
  java: "/api/placeholder/400/300",
  cpp: "/api/placeholder/400/300",
  c: "/api/placeholder/400/300",
  html: "/api/placeholder/400/300",
  css: "/api/placeholder/400/300",
};

const toolSections = [
  { id: "code", name: "Code Editor", icon: <Code className="h-4 w-4" /> },
  { id: "visualize", name: "Visualize", icon: <Image className="h-4 w-4" /> },
  { id: "debug", name: "Debug", icon: <FileCode className="h-4 w-4" /> },
  { id: "share", name: "Share", icon: <ExternalLink className="h-4 w-4" /> },
];

export default function EnhancedOnlineCompiler() {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState([{ name: "main.js", content: boilerplates.javascript, language: "javascript" }]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState(14);
  const [savedCodes, setSavedCodes] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const previewIframeRef = useRef(null);
  const [activeSection, setActiveSection] = useState("code");
  const [editorHeight, setEditorHeight] = useState(200); // Smaller default height

  const languages = {
    javascript: { ext: "js", version: "18.15.0", extension: javascript(), label: "JavaScript" },
    python: { ext: "py", version: "3.10.0", extension: python(), label: "Python" },
    java: { ext: "java", version: "15.0.2", extension: java(), label: "Java" },
    cpp: { ext: "cpp", version: "10.2.0", extension: cpp(), label: "C++" },
    c: { ext: "c", version: "10.2.0", extension: cpp(), label: "C" },
    html: { ext: "html", version: "latest", extension: html({ autoCloseTags: true }), label: "HTML" },
    css: { ext: "css", version: "latest", extension: css(), label: "CSS" }
  };

  useEffect(() => {
    const saved = localStorage.getItem("savedCodes");
    if (saved) setSavedCodes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (previewVisible && tabs[activeTab].language === "html") updatePreview();
  }, [previewVisible, tabs, activeTab]);

  const handleTabChange = (index) => {
    setActiveTab(index);
    document.querySelector(".cm-editor")?.focus();
    setPreviewVisible(tabs[index].language === "html");
  };

  const addNewTab = () => {
    const lang = "javascript";
    const newTab = { name: `file${tabs.length + 1}.${languages[lang].ext}`, content: boilerplates[lang], language: lang };
    setTabs([...tabs, newTab]);
    setActiveTab(tabs.length);
  };

  const closeTab = (index, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, i) => i !== index);
    setTabs(newTabs);
    setActiveTab(Math.min(activeTab, newTabs.length - 1));
  };

  const changeLanguage = (e) => {
    const newLang = e.target.value;
    const updatedTabs = [...tabs];
    const currentTab = updatedTabs[activeTab];
    const isUsingBoilerplate = Object.values(boilerplates).some(bp => currentTab.content === bp || currentTab.content.trim() === "");
    currentTab.language = newLang;
    currentTab.name = `${currentTab.name.split('.')[0]}.${languages[newLang].ext}`;
    if (isUsingBoilerplate) currentTab.content = boilerplates[newLang] || "";
    setTabs(updatedTabs);
    setPreviewVisible(newLang === "html");
  };

  const updatePreview = () => {
    if (!previewIframeRef.current) return;
    const currentTab = tabs[activeTab];
    if (currentTab.language === "html") {
      const iframe = previewIframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(currentTab.content);
      doc.close();
    }
  };

  const executeCode = async () => {
    setLoading(true);
    setOutput("🚀 Executing code...");
    const currentTab = tabs[activeTab];
    if (currentTab.language === "html") {
      setPreviewVisible(true);
      updatePreview();
      setOutput("HTML preview updated.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: currentTab.language === "c" ? "c" : currentTab.language,
          version: languages[currentTab.language]?.version || "latest",
          files: [{ content: currentTab.content }],
        }),
      });
      const data = await response.json();
      setOutput(data.run?.output || data.run?.stderr || "No output");
    } catch (error) {
      setOutput(`❌ Error: ${error.message}`);
    }
    setLoading(false);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(tabs[activeTab].content);
    showToast("📋 Code copied to clipboard!");
  };

  const saveCode = () => {
    const currentTab = tabs[activeTab];
    const newSavedCode = { id: Date.now(), name: currentTab.name, language: currentTab.language, content: currentTab.content };
    const updatedSavedCodes = [...savedCodes, newSavedCode];
    setSavedCodes(updatedSavedCodes);
    localStorage.setItem("savedCodes", JSON.stringify(updatedSavedCodes));
    showToast("💾 Code saved successfully!");
  };

  const loadSavedCode = (code) => {
    setTabs([...tabs, { name: code.name, language: code.language, content: code.content }]);
    setActiveTab(tabs.length);
    showToast("📂 Loaded saved code");
  };

  const deleteSavedCode = (id, e) => {
    e.stopPropagation();
    const updatedSavedCodes = savedCodes.filter(code => code.id !== id);
    setSavedCodes(updatedSavedCodes);
    localStorage.setItem("savedCodes", JSON.stringify(updatedSavedCodes));
    showToast("🗑️ Code deleted");
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = `toast-animate fixed top-4 right-4 px-4 py-2 rounded-md bg-emerald-600 text-white font-medium shadow-lg z-50 transition-transform transform scale-100 opacity-100`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("scale-0");
      toast.classList.remove("opacity-100");
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const getEditorTheme = () => [
    theme === 'dark' ? draculaTheme : githubLightTheme,
    EditorView.theme({ "&": { fontSize: `${fontSize}px` }, ".cm-content": { fontSize: `${fontSize}px`, textAlign: "left" }, ".cm-gutters": { fontSize: `${fontSize}px` } })
  ];

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent flex items-center">
          <Code className="mr-1 h-4 w-4" /> Learn Without Limits IDE
        </h1>
        <div className="flex items-center gap-2">
          <select value={theme} onChange={(e) => setTheme(e.target.value)}
            className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-800 border border-gray-300'} focus:outline-none transition-colors duration-300`}>
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
          <select value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))}
            className={`px-2 py-1 text-xs rounded-md ${theme === 'dark' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white text-gray-800 border border-gray-300'} focus:outline-none transition-colors duration-300`}>
            {[12, 14, 16, 18, 20].map(size => (<option key={size} value={size}>{size}px</option>))}
          </select>
        </div>
      </div>

      {/* Tool Section Tabs */}
      <div className={`flex border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-100'}`}>
        {toolSections.map((section) => (
          <button key={section.id} onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-3 py-1 text-xs ${
              activeSection === section.id 
                ? theme === 'dark' ? 'bg-gray-700 text-white border-b-2 border-blue-500' : 'bg-white text-gray-900 border-b-2 border-blue-500'
                : theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
            } transition-colors duration-300`}>
            <span className="mr-1">{section.icon}</span> {section.name}
          </button>
        ))}
      </div>

      {/* Main Content Area with Split View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Area - Code Editor */}
        <div className="w-3/5 flex flex-col">
          {/* File tabs */}
          <div className="flex items-center border-b border-gray-700 overflow-x-auto">
            {tabs.map((tab, index) => (
              <div key={index} onClick={() => handleTabChange(index)}
                className={`group flex items-center px-2 py-1 border-r border-gray-700 cursor-pointer transition-colors duration-300 ${
                  activeTab === index 
                    ? theme === 'dark' ? 'bg-gray-800' : 'bg-white' 
                    : theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'bg-gray-100 hover:bg-gray-50'
                }`}>
                <FileCode className="mr-1 h-3 w-3" />
                <span className="text-xs font-mono">{tab.name}</span>
                <X onClick={(e) => closeTab(index, e)}
                  className="ml-1 h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all duration-300" />
              </div>
            ))}
            <button onClick={addNewTab}
              className={`px-2 py-1 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors duration-300`}>
              <PlusCircle className="h-3 w-3" />
            </button>
          </div>

          {/* Editor Controls */}
          <div className={`flex items-center justify-between px-2 py-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="flex items-center gap-2">
              <label className="text-xs">Language:</label>
              <select value={tabs[activeTab].language} onChange={changeLanguage}
                className={`px-2 py-0.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} focus:outline-none transition-colors duration-300`}>
                {Object.entries(languages).map(([key, { label }]) => (<option key={key} value={key}>{label}</option>))}
              </select>
              <select value={editorHeight} onChange={(e) => setEditorHeight(parseInt(e.target.value))}
                className={`px-2 py-0.5 text-xs rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} focus:outline-none transition-colors duration-300`}>
                <option value={200}>Small</option>
                <option value={300}>Medium</option>
                <option value={400}>Large</option>
              </select>
            </div>
            <div className="flex gap-1">
              <button onClick={executeCode} disabled={loading}
                className="flex items-center px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-all duration-300 disabled:opacity-50 text-xs">
                {loading ? <Loader2 className="animate-spin mr-1 h-3 w-3" /> : <Play className="mr-1 h-3 w-3" />} Run
              </button>
              <button onClick={copyCode}
                className="flex items-center px-1 py-0.5 bg-gray-600 hover:bg-gray-700 text-white rounded transition-all duration-300 text-xs">
                <Copy className="h-3 w-3" />
              </button>
              <button onClick={saveCode}
                className="flex items-center px-1 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded transition-all duration-300 text-xs">
                <Save className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div style={{ height: `${editorHeight}px` }}>
            <CodeMirror value={tabs[activeTab].content} height="100%" 
              extensions={[
                languages[tabs[activeTab].language]?.extension,
                keymap.of([
                  { key: "Ctrl-s", run: saveCode, preventDefault: true },
                  { key: "Ctrl-Enter", run: executeCode, preventDefault: true }
                ]),
                autocompletion(),
              ]}
              onChange={(value) => {
                const updatedTabs = [...tabs];
                updatedTabs[activeTab].content = value;
                setTabs(updatedTabs);
                if (previewVisible && updatedTabs[activeTab].language === "html") updatePreview();
              }}
              theme={getEditorTheme()}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                highlightSelectionMatches: true,
                autocompletion: true,
              }}
              className="overflow-auto"
            />
          </div>

          {/* Output Console */}
          <div className={`border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} flex-1 overflow-hidden flex flex-col`}>
            <div className={`p-1 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex items-center`}>
              <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} flex items-center`}>
                <ExternalLink className="h-3 w-3 mr-1" /> Output Console
              </h3>
            </div>
            <pre className={`font-mono text-xs ${theme === 'dark' ? 'text-gray-300 bg-gray-850' : 'text-gray-700 bg-gray-50'} p-2 overflow-auto flex-1`}>
              {loading ? '⏳ Processing...' : output || "// Output will appear here"}
            </pre>
          </div>
        </div>

        {/* Right Area - Visualization, Preview, Saved Snippets */}
        <div className={`w-2/5 border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} flex flex-col`}>
          {activeSection === "visualize" ? (
            <div className="flex-1 flex flex-col">
              <div className={`p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <h3 className="text-xs font-semibold">Visualization</h3>
              </div>
              <div className="flex-1 flex items-center justify-center p-3">
                <div className="bg-white rounded-lg overflow-hidden shadow-md">
                  <img src={visualizationImages[tabs[activeTab].language]} 
                    alt={`${languages[tabs[activeTab].language]?.label} visualization`} 
                    className="w-full h-auto" />
                  <div className="p-2 text-center text-gray-700 text-xs">
                    {languages[tabs[activeTab].language]?.label} Code Visualization
                  </div>
                </div>
              </div>
            </div>
          ) : previewVisible && tabs[activeTab].language === "html" ? (
            <div className="flex-1 flex flex-col">
              <div className={`p-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}>
                <h3 className="text-xs font-semibold">HTML Preview</h3>
                <button onClick={() => setPreviewVisible(false)}
                  className={`text-xs px-2 py-0.5 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}>
                  Hide
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-white">
                <iframe ref={previewIframeRef} title="HTML Preview" className="w-full h-full border-none" sandbox="allow-scripts"></iframe>
              </div>
            </div>
          ) : (
            <div className="p-3 overflow-auto flex-1">
              <h3 className={`text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2 flex items-center`}>
                <CheckCircle className="h-3 w-3 mr-1" /> Saved Snippets
              </h3>
              {savedCodes.length === 0 ? (
                <div className={`text-xs italic ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  No saved code snippets yet. Use the save button to add some!
                </div>
              ) : (
                <div className="space-y-1">
                  {savedCodes.map((code) => (
                    <div key={code.id} onClick={() => loadSavedCode(code)}
                      className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} 
                      cursor-pointer transition-colors duration-300 group relative`}>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} truncate font-medium`}>
                        {code.name}
                      </div>
                      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {languages[code.language]?.label || code.language}
                      </div>
                      <button onClick={(e) => deleteSavedCode(code.id, e)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <X className="h-3 w-3 text-red-500 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}