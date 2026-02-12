import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './Chat.css';

const CONVERSATION_ID = 'main-chat';

const QUICK_ACTIONS = [
  { label: 'Draft an email', prompt: 'Help me draft an email' },
  { label: 'Find a restaurant', prompt: 'Help me find a restaurant for dinner' },
  { label: 'Manage my tasks', prompt: 'Help me organize my tasks for today' },
  { label: 'Summarize an email', prompt: 'I need help summarizing and replying to an email' },
];

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async (text) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          conversationId: CONVERSATION_ID,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
      } else {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Unable to connect to the server. Make sure the backend is running on port 3001.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h2>Hi, I'm Aria</h2>
            <p>Your personal AI assistant. I can help you draft emails, find restaurants, manage tasks, and more.</p>
            <div className="quick-actions">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  className="quick-action"
                  onClick={() => sendMessage(action.prompt)}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="message-avatar">A</div>
              )}
              <div className="message-content">
                {msg.role === 'assistant' ? (
                  <div className="markdown-content">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="message assistant">
            <div className="message-avatar">A</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Aria anything..."
            rows={1}
          />
          <button
            className="send-button"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
