import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      await login(username, password);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError('गलत username या password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          background: '#ffffff',
          borderRadius: '16px',
          padding: '32px',
          boxSizing: 'border-box',
          boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '28px',
              fontWeight: '700',
              color: '#111827',
            }}
          >
            Admin Panel
          </h1>

          <p
            style={{
              margin: 0,
              color: '#6b7280',
              fontSize: '15px',
            }}
          >
            कृपया login करें
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}
            >
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              autoComplete="username"
              required
              style={{
                width: '100%',
                height: '46px',
                padding: '0 13px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '7px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                height: '46px',
                padding: '0 13px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                outline: 'none',
                fontSize: '15px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                marginBottom: '18px',
                padding: '11px 12px',
                borderRadius: '8px',
                background: '#fee2e2',
                color: '#b91c1c',
                fontSize: '14px',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '46px',
              border: 'none',
              borderRadius: '8px',
              background: '#111827',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div
          style={{
            textAlign: 'center',
            marginTop: '22px',
          }}
        >
          <Link
            to="/"
            style={{
              color: '#374151',
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            ← वापस वेबसाइट पर जाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}
