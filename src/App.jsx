import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState(() => {
    // Load chat history from sessionStorage on component mount
    const savedHistory = sessionStorage.getItem('chatHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('darkMode');
    return savedTheme ? JSON.parse(savedTheme) : true;
  });
  const chatEndRef = useRef(null);

  // Save chat history to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Save theme preference to localStorage and apply theme
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  async function generateAnswer() {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      // Build conversation history for context
      const conversationHistory = [];
      
      // Add system prompt at the beginning of new conversations
      if (chatHistory.length === 0) {
        conversationHistory.push({
          role: "user",
          parts: [{ text: "You are J. ChatBot, a helpful and friendly AI assistant. Remember details from our conversation to provide personalized responses. Be conversational and remember what the user tells you about themselves." }]
        });
        conversationHistory.push({
          role: "model",
          parts: [{ text: "Hello! I'm J. ChatBot, your AI assistant. I'll remember our conversation to provide you with more personalized help. What can I assist you with today?" }]
        });
      }
      
      // Add previous chat history
      chatHistory.forEach(chat => {
        conversationHistory.push({
          role: "user",
          parts: [{ text: chat.question }]
        });
        conversationHistory.push({
          role: "model",
          parts: [{ text: chat.answer }]
        });
      });
      
      // Add current question
      conversationHistory.push({
        role: "user",
        parts: [{ text: question }]
      });

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setChatHistory([...chatHistory, { question, answer: generatedAnswer }]);
      setQuestion('');
    } catch (error) {
      console.error("Error generating answer:", error);
      const errorMessage = error.response?.status === 429 
        ? "Rate limit exceeded. Please wait a moment and try again."
        : error.response?.status === 401
        ? "Invalid API key. Please check your configuration."
        : error.response?.data?.error?.message
        ? `API Error: ${error.response.data.error.message}`
        : "Sorry, I encountered an error. Please try again.";
      
      setChatHistory([...chatHistory, { 
        question, 
        answer: errorMessage 
      }]);
      setQuestion('');
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !loading) {
        generateAnswer();
      }
    }
  }

  function clearLogs() {
    setChatHistory([]);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
      <header className="app-header">
        <h1 className="app-title">J. ChatBot</h1>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>
      
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>Hello! I'm J. ChatBot, your AI assistant.</p>
              <p>I'll remember our conversation to provide personalized responses. What can I help you with today?</p>
            </div>
          ) : (
            chatHistory.map((chat, index) => (
              <div key={index} className="chat-message">
                <div className="user-message">
                  <div className="message-avatar user-avatar">👤</div>
                  <div className="message-content">{chat.question}</div>
                </div>
                <div className="bot-message">
                  <div className="message-avatar bot-avatar">🤖</div>
                  <div className="message-content">{chat.answer}</div>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      
      <div className="input-container">
        <div className="textarea-wrapper">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder='Ask me anything... (Press Enter to send, Shift+Enter for new line)'
            onKeyPress={handleKeyPress}
            disabled={loading}
            rows="3"
            className="chat-input"
          />
          {loading && (
            <div className="loading-overlay">
              <div className="spinner"></div>
            </div>
          )}
        </div>
        
        <div className="button-group">
          <button 
            className="btn btn-primary" 
            onClick={generateAnswer}
            disabled={loading || !question.trim()}
          >
            {loading ? 'Generating...' : 'Send'}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clearLogs}
            disabled={chatHistory.length === 0}
          >
            Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
