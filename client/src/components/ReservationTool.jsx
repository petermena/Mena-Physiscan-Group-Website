import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './ToolPanel.css';

function ReservationTool() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [occasion, setOccasion] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [budget, setBudget] = useState('moderate');
  const [preferences, setPreferences] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setResult('');
    try {
      const response = await fetch('/api/reservations/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuisine, location, occasion, partySize, budget, preferences }),
      });
      const data = await response.json();
      setResult(data.suggestions);
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
          <div className="tool-intro">
            <h3>Find the Perfect Restaurant</h3>
            <p>Tell Aria your preferences and get personalized restaurant recommendations with reservation scripts.</p>
          </div>

          <div className="form-fields">
            <div className="field-row">
              <div className="field">
                <label>Cuisine Type</label>
                <input
                  type="text"
                  value={cuisine}
                  onChange={e => setCuisine(e.target.value)}
                  placeholder="e.g. Italian, Japanese, Steakhouse"
                />
              </div>
              <div className="field">
                <label>Location / Area</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Downtown Miami, Manhattan"
                />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Occasion</label>
                <select value={occasion} onChange={e => setOccasion(e.target.value)}>
                  <option value="">Select occasion...</option>
                  <option value="date night">Date Night</option>
                  <option value="business dinner">Business Dinner</option>
                  <option value="birthday celebration">Birthday Celebration</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="family gathering">Family Gathering</option>
                  <option value="casual dining">Casual Dining</option>
                  <option value="special celebration">Special Celebration</option>
                </select>
              </div>
              <div className="field">
                <label>Party Size</label>
                <select value={partySize} onChange={e => setPartySize(e.target.value)}>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6">6 people</option>
                  <option value="8">8 people</option>
                  <option value="10+">10+ people</option>
                </select>
              </div>
            </div>
            <div className="field">
              <label>Budget</label>
              <select value={budget} onChange={e => setBudget(e.target.value)}>
                <option value="budget-friendly">Budget-Friendly ($)</option>
                <option value="moderate">Moderate ($$)</option>
                <option value="upscale">Upscale ($$$)</option>
                <option value="fine dining">Fine Dining ($$$$)</option>
              </select>
            </div>
            <div className="field">
              <label>Other Preferences (optional)</label>
              <textarea
                value={preferences}
                onChange={e => setPreferences(e.target.value)}
                placeholder="e.g. outdoor seating, quiet atmosphere, great wine list, vegetarian-friendly..."
                rows={3}
              />
            </div>
            <button className="action-button" onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Find Restaurants'}
            </button>
          </div>
        </div>

        {(result || loading) && (
          <div className="tool-result">
            <div className="result-header">
              <h3>Restaurant Recommendations</h3>
            </div>
            <div className="result-content markdown-content">
              {loading ? (
                <div className="loading-text">Searching for the perfect spot...</div>
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

export default ReservationTool;
