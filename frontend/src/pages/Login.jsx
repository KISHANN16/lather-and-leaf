import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import ScrollReveal from '../components/ScrollReveal';

const Login = () => {
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, user } = useAuth();
  const { showToast } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, redirect, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await login(email, password);
      showToast('Logged in successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code.');
      }

      setSuccessMsg('Verification code generated successfully! Retrieve the 6-digit code from your backend server terminal console log.');
      setView('reset');
    } catch (err) {
      setErrorMsg(err.message || 'Email verification failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: resetCode, password: newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password.');
      }

      setSuccessMsg('Password reset successful! You can now log in with your new password.');
      setView('login');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Password reset failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle} className="container animate-fade-in">
      <ScrollReveal direction="up" duration={0.8} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={formWrapper} className="glass-panel">
        {view === 'login' && (
          <>
            <div style={formHeader}>
              <span style={lockIconWrap}>
                <KeyRound size={28} style={{ color: '#4A5D4E' }} />
              </span>
              <h1 style={titleStyle}>Welcome Back</h1>
              <p style={subStyle}>Sign in to trace order histories and update shipping details.</p>
            </div>

            {errorMsg && <div style={errorBanner}>{errorMsg}</div>}
            {successMsg && <div style={successBanner}>{successMsg}</div>}

            <form onSubmit={handleLoginSubmit}>
              <div style={formGroup}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWithIcon}>
                  <Mail size={16} style={inputIcon} />
                  <input
                    type="email"
                    required
                    style={inputStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <div style={formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label style={labelStyle}>Password</label>
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setErrorMsg(''); setSuccessMsg(''); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#4A5D4E',
                      fontSize: '12.5px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      padding: 0,
                      marginBottom: '6px'
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div style={inputWithIcon}>
                  <KeyRound size={16} style={inputIcon} />
                  <input
                    type="password"
                    required
                    style={inputStyle}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} style={submitBtn}>
                {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={footerText}>
              Don't have an account? <Link to="/register" style={linkStyle}>Register Here</Link>
            </div>
          </>
        )}

        {view === 'forgot' && (
          <>
            <div style={formHeader}>
              <span style={lockIconWrap}>
                <Mail size={28} style={{ color: '#4A5D4E' }} />
              </span>
              <h1 style={titleStyle}>Forgot Password</h1>
              <p style={subStyle}>Enter your email address to receive a simulated 6-digit verification code in the terminal console.</p>
            </div>

            {errorMsg && <div style={errorBanner}>{errorMsg}</div>}

            <form onSubmit={handleForgotSubmit}>
              <div style={formGroup}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWithIcon}>
                  <Mail size={16} style={inputIcon} />
                  <input
                    type="email"
                    required
                    style={inputStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} style={submitBtn}>
                {submitting ? 'Sending Code...' : 'Request Verification Code'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={footerText}>
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4A5D4E',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13.5px'
                }}
              >
                Sign In Here
              </button>
            </div>
          </>
        )}

        {view === 'reset' && (
          <>
            <div style={formHeader}>
              <span style={lockIconWrap}>
                <KeyRound size={28} style={{ color: '#4A5D4E' }} />
              </span>
              <h1 style={titleStyle}>Reset Password</h1>
              <p style={subStyle}>Enter the verification code printed in your server logs and choose a new password.</p>
            </div>

            {errorMsg && <div style={errorBanner}>{errorMsg}</div>}
            {successMsg && <div style={successBanner}>{successMsg}</div>}

            <form onSubmit={handleResetSubmit}>
              <div style={formGroup}>
                <label style={labelStyle}>Email Address</label>
                <div style={inputWithIcon}>
                  <Mail size={16} style={inputIcon} />
                  <input
                    type="email"
                    disabled
                    style={{ ...inputStyle, backgroundColor: '#F3F4F6', color: '#6B7280' }}
                    value={email}
                  />
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>6-Digit Verification Code</label>
                <div style={inputWithIcon}>
                  <KeyRound size={16} style={inputIcon} />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    style={inputStyle}
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    placeholder="123456"
                  />
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>New Password</label>
                <div style={inputWithIcon}>
                  <KeyRound size={16} style={inputIcon} />
                  <input
                    type="password"
                    required
                    style={inputStyle}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button type="submit" disabled={submitting} style={submitBtn}>
                {submitting ? 'Updating Password...' : 'Reset Password'} <ArrowRight size={16} />
              </button>
            </form>

            <div style={footerText}>
              <button
                type="button"
                onClick={() => { setView('login'); setErrorMsg(''); setSuccessMsg(''); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4A5D4E',
                  fontWeight: '700',
                  cursor: 'pointer',
                  padding: 0,
                  fontSize: '13.5px'
                }}
              >
                Back to Sign In
              </button>
            </div>
          </>
        )}
        </div>
      </ScrollReveal>
    </div>
  );
};

// CSS in JS Styling
const containerStyle = {
  paddingTop: '60px',
  fontFamily: "'Inter', sans-serif",
  display: 'flex',
  justifyContent: 'center',
};

const formWrapper = {
  width: '100%',
  maxWidth: '460px',
  padding: '40px',
  backgroundColor: '#FFFDF9',
};

const formHeader = {
  textAlign: 'center',
  marginBottom: '30px',
};

const lockIconWrap = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: '#EEF0F2',
  marginBottom: '16px',
};

const titleStyle = {
  fontSize: '28px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '6px',
};

const subStyle = {
  fontSize: '14px',
  color: '#5E5A57',
  lineHeight: '1.5',
};

const errorBanner = {
  backgroundColor: '#FFF0F0',
  color: '#b23b3b',
  border: '1px solid rgba(178, 59, 59, 0.15)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '13.5px',
  fontWeight: '600',
  marginBottom: '20px',
};

const successBanner = {
  backgroundColor: '#EAF6EC',
  color: '#2E7D32',
  border: '1px solid rgba(46, 125, 50, 0.15)',
  padding: '12px 16px',
  borderRadius: '8px',
  fontSize: '13.5px',
  fontWeight: '600',
  marginBottom: '20px',
};

const formGroup = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  marginBottom: '6px',
  color: '#1C1A19',
};

const inputWithIcon = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const inputIcon = {
  position: 'absolute',
  left: '14px',
  color: '#A09690',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px 12px 42px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: '#FFF',
  fontFamily: "'Inter', sans-serif",
};

const submitBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(74, 93, 78, 0.12)',
  marginTop: '10px',
  fontSize: '15px',
};

const footerText = {
  textAlign: 'center',
  marginTop: '24px',
  fontSize: '13.5px',
  color: '#5E5A57',
};

const linkStyle = {
  color: '#4A5D4E',
  fontWeight: '700',
};

export default Login;
