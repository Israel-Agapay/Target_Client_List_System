import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { username, password });
      login(res.data.token, res.data.username);
      navigate('/dashboard');
    } catch (err: any) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#0f1923' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,200,160,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Heading + TCLS ghost overlay */}
      <div className="relative z-10 flex flex-col items-center mb-8 px-4" style={{ textAlign: 'center' }}>
        {/* TCLS ghost — absolute, centered behind heading text */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ zIndex: 0, transform: 'translateY(-50%)' }}  // ← RELATIVE NA, responsive
        >
          <span
            className="font-black uppercase"
            style={{
              fontSize: 'clamp(72px, 12vw, 130px)',
              color: 'transparent',
              WebkitTextStroke: '1.5px rgba(0,200,160,0.18)',
              letterSpacing: '0.1em',
              lineHeight: 1,
            }}
          >
            TCLS
          </span>
        </div>

        {/* Heading text on top */}
        <div className="relative" style={{ zIndex: 1 }}>
          <h1
            className="font-black uppercase tracking-widest"
            style={{
              fontSize: 'clamp(24px, 3vw, 30px)',
              color: '#00d4aa',
              textShadow: '0 0 40px rgba(0,212,170,0.45)',
            }}
          >
            Target Client List System
          </h1>
          <h2
            className="font-extrabold uppercase tracking-widest mt-1"
            style={{ fontSize: 'clamp(14px, 2vw, 20px)', color: '#cdd6e0' }}
          >
            Barangay Mercado
          </h2>
          <p className="text-sm mt-2" style={{ color: '#7a8a96' }}>
            Family Planning Services
          </p>
        </div>
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full"
        style={{ maxWidth: '480px', padding: '0 1.25rem' }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '20px',
            padding: '2rem 2.25rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 24px 64px rgba(0,0,0,0.5)',
          }}
        >
          {error && (
            <div
              className="text-center text-sm mb-5"
              style={{
                background: 'rgba(239,68,68,0.09)',
                border: '1px solid rgba(239,68,68,0.22)',
                color: '#f87171',
                padding: '10px 16px',
                borderRadius: '999px',
              }}
            >
              {error}
            </div>
          )}

          {/* Username */}
          <label className="block text-sm mb-2" style={{ color: '#b0bcc8' }}>
            Username
          </label>
          <div className="relative mb-5">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#4a5a66' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full text-sm focus:outline-none transition-all"
              style={{
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                color: '#e2e8f0',
                padding: '13px 18px 13px 44px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(0,212,170,0.45)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.07)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Password */}
          <label className="block text-sm mb-2" style={{ color: '#b0bcc8' }}>
            Password
          </label>
          <div className="relative mb-6">
            <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#4a5a66' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••••"
              className="w-full text-sm focus:outline-none transition-all"
              style={{
                background: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                color: '#e2e8f0',
                padding: '13px 52px 13px 44px',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(0,212,170,0.45)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0,212,170,0.07)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
              style={{
                width: '38px', height: '38px',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '999px',
                color: '#7a8a96', cursor: 'pointer',
              }}
            >
              {showPassword ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>

          {/* CTA */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full font-bold transition-opacity disabled:opacity-50"
            style={{
              padding: '15px',
              background: 'linear-gradient(90deg, #00d4aa, #00c49a)',
              border: 'none',
              borderRadius: '999px',
              color: '#041210',
              fontSize: '15px',
              letterSpacing: '0.04em',
              boxShadow: '0 4px 28px rgba(0,212,170,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Logging in...' : 'Sign In Now'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs text-center relative z-10" style={{ color: '#3a4a56' }}>
        Copyright © 2025 Barangay Mercado. All Rights Reserved.
      </p>
    </div>
  );
};

export default Login;
