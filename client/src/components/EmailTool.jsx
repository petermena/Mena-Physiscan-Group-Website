import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ToolPanel.css';

function EmailTool() {
  const [mode, setMode] = useState('draft'); // 'draft' or 'reply'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  // Draft state
  const [recipientName, setRecipientName] = useState('');
  const [subject, setSubject] = useState('');
  const [context, setContext] = useState('');
  const [tone, setTone] = useState('professional');

  // Reply state
  const [originalEmail, setOriginalEmail] = useState('');
  const [instructions, setInstructions] = useState('');
  const [replyTone, setReplyTone] = useState('match original');

  const handleDraft = async () => {
    if (!context.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/email/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context, tone, recipientName, subject }),
      });
      const data = await response.json();
      setResult(data.draft);
    } catch {
      setResult('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!originalEmail.trim() || !instructions.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/email/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalEmail, instructions, tone: replyTone }),
      });
      const data = await response.json();
      setResult(data.reply);
    } catch {
      setResult('Failed to connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-panel">
      <div className="tool-content">
        <div className="tool-form">
          <div className="mode-tabs">
            <button
              className={`mode-tab ${mode === 'draft' ? 'active' : ''}`}
              onClick={() => { setMode('draft'); setResult(''); }}
            >
              Draft New Email
            </button>
            <button
              className={`mode-tab ${mode === 'reply' ? 'active' : ''}`}
              onClick={() => { setMode('reply'); setResult(''); }}
            >
              Reply to Email
            </button>
          </div>

          {mode === 'draft' ? (
            <div className="form-fields">
              <div className="field-row">
                <div className="field">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={e => setRecipientName(e.target.value)}
                    placeholder="e.g. John Smith"
                  />
                </div>
                <div className="field">
                  <label>Tone</label>
                  <select value={tone} onChange={e => setTone(e.target.value)}>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="apologetic">Apologetic</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label>Subject (optional)</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Aria will suggest one if left blank"
                />
              </div>
              <div className="field">
                <label>What should the email say?</label>
                <textarea
                  value={context}
                  onChange={e => setContext(e.target.value)}
                  placeholder="Describe what you want to communicate. E.g.: Thank them for the meeting yesterday and confirm next steps about the project timeline..."
                  rows={5}
                />
              </div>
              <button className="action-button" onClick={handleDraft} disabled={loading || !context.trim()}>
                {loading ? 'Drafting...' : 'Draft Email'}
              </button>
            </div>
          ) : (
            <div className="form-fields">
              <div className="field">
                <label>Paste the email you received</label>
                <textarea
                  value={originalEmail}
                  onChange={e => setOriginalEmail(e.target.value)}
                  placeholder="Paste the full email content here..."
                  rows={6}
                />
              </div>
              <div className="field">
                <label>How should I reply?</label>
                <textarea
                  value={instructions}
                  onChange={e => setInstructions(e.target.value)}
                  placeholder="E.g.: Politely decline the meeting but suggest rescheduling to next week..."
                  rows={3}
                />
              </div>
              <div className="field">
                <label>Reply Tone</label>
                <select value={replyTone} onChange={e => setReplyTone(e.target.value)}>
                  <option value="match original">Match Original</option>
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>
              <button className="action-button" onClick={handleReply} disabled={loading || !originalEmail.trim() || !instructions.trim()}>
                {loading ? 'Generating Reply...' : 'Generate Reply'}
              </button>
            </div>
          )}
        </div>

        {(result || loading) && (
          <div className="tool-result">
            <div className="result-header">
              <h3>Aria's Draft</h3>
              {result && (
                <button
                  className="copy-button"
                  onClick={() => navigator.clipboard.writeText(result)}
                >
                  Copy
                </button>
              )}
            </div>
            <div className="result-content markdown-content">
              {loading ? (
                <div className="loading-text">Thinking...</div>
              ) : (
                <ReactMarkdown>{result}</ReactMarkdown>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EmailTool;
