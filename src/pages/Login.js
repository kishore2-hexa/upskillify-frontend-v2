import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthUI.css';

const AuthUI = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  // API calls to your FastAPI backend
  const authenticateUser = async (username, password) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


  const registerUser = async (username, password) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      if (isLogin) {
        // Login logic
        const result = await authenticateUser(formData.username, formData.password);
        if (result.success || result.username) {
          setMessage({ type: 'success', text: 'Login successful!' });
          setIsAuthenticated(true);
          setCurrentUser(formData.username);
          
          // Redirect to dashboard after a brief delay to show success message
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setMessage({ type: 'error', text: 'Invalid credentials.' });
        }
      } else {
        // Register logic
        const result = await registerUser(formData.username, formData.password);
        if (result.success || result.username) {
          setMessage({ type: 'success', text: `Welcome, ${formData.username}! Please login.` });
          setIsLogin(true);
          setFormData({ username: '', password: '' });
        } else {
          setMessage({ type: 'error', text: result.message || 'Username already exists.' });
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setFormData({ username: '', password: '' });
    setMessage({ type: '', text: '' });
    // Redirect to auth page (current page) or you can redirect to a specific login route
    navigate('/auth', { replace: true });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage({ type: '', text: '' });
    setFormData({ username: '', password: '' });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (isAuthenticated) {
    return (
      <div className="auth-page">
        <div className="auth-container welcome-container">
          <div className="auth-accent"></div>
          <div className="welcome-content">
            <div className="welcome-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>
            <h2 className="welcome-title">Welcome</h2>
            <p className="welcome-subtitle">Hello, {currentUser}</p>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-accent"></div>
        
        <div className="auth-header">
          <div className="auth-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 className="auth-title">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="auth-subtitle">
            {isLogin ? 'Please sign in to continue' : 'Please fill in your details'}
          </p>
        </div>

        {message.text && (
          <div className={`message ${message.type}`}>
            <div className="message-icon">
              {message.type === 'success' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              )}
            </div>
            <span className="message-text">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label className="input-label">Username</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="auth-input"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-wrapper">
              <div className="input-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="auth-input"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="submit-btn"
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <>
                <span>{isLogin ? 'Sign in' : 'Create account'}</span>
                <svg className="submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12,5 19,12 12,19" />
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle">
          <p className="toggle-text">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button onClick={toggleMode} className="toggle-btn">
            {isLogin ? 'Create account' : 'Sign in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthUI;