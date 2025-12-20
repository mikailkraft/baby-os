import React, { useState } from 'react';

interface ConfigScreenProps {
  onSave: (url: string, password?: string) => void;
  initialUrl?: string;
  initialPassword?: string;
}

export const ConfigScreen: React.FC<ConfigScreenProps> = ({ onSave, initialUrl = '', initialPassword = '' }) => {
  const [url, setUrl] = useState(initialUrl);
  const [password, setPassword] = useState(initialPassword);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      setError('API URL is required');
      return;
    }
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }
    setError('');
    onSave(url, password);
  };

  return (
    <div className="full-screen-center">
      <div className="glass-panel fade-in" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
        <h1 style={{ marginTop: 0, marginBottom: '8px', fontSize: '2rem', textAlign: 'center' }}>Baby OS</h1>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '32px' }}>
          Connect your Craft document
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              API URL
            </label>
            <input
              type="url"
              className="input-field"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://connect.craft.do/..."
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Password (Optional)
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div style={{ color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};
