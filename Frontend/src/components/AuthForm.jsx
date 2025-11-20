// src/components/AuthForm.jsx
import React, { useState } from "react";
import { Home, Eye, EyeOff } from "lucide-react"; 
import "../AuthForm.css";

export function AuthForm({ onSignIn, onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const data = await onSignUp(email, password, fullName);
        if (data?.error) setError(data.error);
      } else {
        const data = await onSignIn(email, password);
        if (data?.error) setError(data.error);
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTheme = () => setDarkMode(prev => !prev);

  return (
    <div className={`auth-container ${darkMode ? "dark" : ""}`}>

      {/* Theme Toggle Switch */}
      <div className="theme-toggle-wrapper">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleToggleTheme}
          />
          <span className="slider round"></span>
        </label>
      </div>

      {/* Brand section */}
      <div className="auth-brand-centered fade-in">
        <Home className="brand-icon-lg" size={60} />
        <h1 className="auth-title">EduQuick</h1>
        <p className="auth-sub">Study Helper — focused, simple, fast.</p>
      </div>

      {/* Auth card */}
      <div className="auth-card fade-in-up">
        <h2 className="auth-heading">
          {isSignUp ? "Create an account" : "Sign in to EduQuick"}
        </h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignUp && (
            <input
              className="input-field"
              type="text"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          <input
            className="input-field"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password with toggle */}
          <div className="password-wrapper">
            <input
              className="input-field password-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading
              ? isSignUp
                ? "Creating..."
                : "Signing in..."
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        {/* Switch Auth Mode */}
        <button
          className="switch-btn"
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(null);
          }}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>
      </div>
    </div>
  );
}
