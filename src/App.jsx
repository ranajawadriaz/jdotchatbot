import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  async function generateAnswer() {
    setLoading(true);
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: question
                }
              ]
            }
          ]
        }
      });

      const generatedAnswer = response.data.candidates[0].content.parts[0].text;
      setChatHistory([...chatHistory, { question, answer: generatedAnswer }]);
      setQuestion('');
    } catch (error) {
      console.error("Error generating answer:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnswer();
    }
  }

  function clearLogs() {
    setChatHistory([]);
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  return (
    <div className="app-container">
      <h1>J. ChatBot</h1>
      <div className="chat-history" style={{ maxHeight: '200px', overflowY: 'scroll', marginBottom: '20px' }}>
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <div><strong>Prompt:</strong> {chat.question}</div>
            <div><strong>Answer:</strong> {chat.answer}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
          rows="4"
          cols="50"
        ></textarea>
        {loading && (
          <div className="loading-spinner" style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
          }}>
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <div >
        <button className='btn' onClick={generateAnswer}>Generate</button>
        <button className='btn' onClick={clearLogs}>Clear Logs</button>
      </div>
    </div>
  );
}

export default App;
