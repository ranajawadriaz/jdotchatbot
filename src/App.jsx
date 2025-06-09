import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
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

  // Custom components for ReactMarkdown
  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      
      if (!inline && language) {
        return (
          <div className="code-block-container">
            <div className="code-block-header">
              <span className="code-language">{language}</span>
              <button 
                className="copy-button"
                onClick={(event) => {
                  navigator.clipboard?.writeText(String(children).replace(/\n$/, ''));
                  // Show feedback
                  const button = event.target;
                  const originalText = button.textContent;
                  button.textContent = '✓ Copied';
                  button.classList.add('copied');
                  setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                  }, 2000);
                }}
                title="Copy code"
              >
                📋 Copy
              </button>
            </div>
            <SyntaxHighlighter
              style={darkMode ? vscDarkPlus : vs}
              language={language}
              PreTag="div"
              className="syntax-highlighter"
              showLineNumbers={language !== 'bash' && language !== 'shell'}
              wrapLines={true}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      } else if (!inline) {
        return (
          <div className="code-block-container">
            <div className="code-block-header">
              <span className="code-language">text</span>
              <button 
                className="copy-button"
                onClick={(event) => {
                  navigator.clipboard?.writeText(String(children).replace(/\n$/, ''));
                  const button = event.target;
                  const originalText = button.textContent;
                  button.textContent = '✓ Copied';
                  button.classList.add('copied');
                  setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                  }, 2000);
                }}
                title="Copy code"
              >
                📋 Copy
              </button>
            </div>
            <SyntaxHighlighter
              style={darkMode ? vscDarkPlus : vs}
              language="text"
              PreTag="div"
              className="syntax-highlighter"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          </div>
        );
      } else {
        return <code className="inline-code" {...props}>{children}</code>;
      }
    },
    p({ children }) {
      return <p className="message-paragraph">{children}</p>;
    },
    ul({ children }) {
      return <ul className="message-list">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="message-ordered-list">{children}</ol>;
    },
    li({ children }) {
      return <li className="message-list-item">{children}</li>;
    },
    blockquote({ children }) {
      return <blockquote className="message-blockquote">{children}</blockquote>;
    },
    h1({ children }) {
      return <h1 className="message-heading-1">{children}</h1>;
    },
    h2({ children }) {
      return <h2 className="message-heading-2">{children}</h2>;
    },
    h3({ children }) {
      return <h3 className="message-heading-3">{children}</h3>;
    },
    h4({ children }) {
      return <h4 className="message-heading-4">{children}</h4>;
    },
    h5({ children }) {
      return <h5 className="message-heading-5">{children}</h5>;
    },
    h6({ children }) {
      return <h6 className="message-heading-6">{children}</h6>;
    },
    strong({ children }) {
      return <strong className="message-bold">{children}</strong>;
    },
    em({ children }) {
      return <em className="message-italic">{children}</em>;
    },
    a({ href, children }) {
      return <a href={href} className="message-link" target="_blank" rel="noopener noreferrer">{children}</a>;
    },
    table({ children }) {
      return (
        <div className="table-container">
          <table className="message-table">{children}</table>
        </div>
      );
    },
    thead({ children }) {
      return <thead className="message-table-head">{children}</thead>;
    },
    tbody({ children }) {
      return <tbody className="message-table-body">{children}</tbody>;
    },
    tr({ children }) {
      return <tr className="message-table-row">{children}</tr>;
    },
    th({ children }) {
      return <th className="message-table-header">{children}</th>;
    },
    td({ children }) {
      return <td className="message-table-cell">{children}</td>;
    },
    hr() {
      return <hr className="message-divider" />;
    }
  };

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
                  <div className="message-content user-content">
                    <ReactMarkdown components={MarkdownComponents}>
                      {chat.question}
                    </ReactMarkdown>
                  </div>
                </div>
                <div className="bot-message">
                  <div className="message-avatar bot-avatar">🤖</div>
                  <div className="message-content bot-content">
                    <ReactMarkdown components={MarkdownComponents}>
                      {chat.answer}
                    </ReactMarkdown>
                  </div>
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
