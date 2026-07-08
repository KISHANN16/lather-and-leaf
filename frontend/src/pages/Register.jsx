import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Mail, KeyRound, ArrowRight } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register, user } = useAuth();
  const { showToast } = useCart();
  
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect') || '/';

  // Redirect if user logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await register(name, email, password);
      showToast('Account registered successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Try a different email.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle} className="container animate-fade-in">
      <ScrollReveal direction="up" duration={0.8} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div style={formWrapper} className="glass-panel">
        <div style={formHeader}>
          <span style={userIconWrap}>
            <User size={28} style={{ color: '#4A5D4E' }} />
          </span>
          <h1 style={titleStyle}>Create Account</h1>
          <p style={subStyle}>Sign up to join our community and receive personalized skincare updates.</p>
        </div>

        {errorMsg && <div style={errorBanner}>{errorMsg}</div>}

        <form onSubmit={handleSubmit}>
          <div style={formGroup}>
            <label style={labelStyle}>Full Name</label>
            <div style={inputWithIcon}>
              <User size={16} style={inputIcon} />
              <input
                type="text"
                required
                style={inputStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
              />
            </div>
          </div>

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
                placeholder="aarav@gmail.com"
              />
            </div>
          </div>

          <div style={formGroup}>
            <label style={labelStyle}>Password</label>
            <div style={inputWithIcon}>
              <KeyRound size={16} style={inputIcon} />
              <input
                type="password"
                required
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
              />
            </div>
          </div>

          <button type="submit" disabled={submitting} style={submitBtn}>
            {submitting ? 'Creating Account...' : 'Register'} <ArrowRight size={16} />
          </button>
        </form>

        <div style={footerText}>
          Already have an account? <Link to="/login" style={linkStyle}>Sign In Here</Link>
        </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

// CSS in JS Styling
const containerStyle = {
  paddingTop: '65px',
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

const userIconWrap = {
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

export default Register;
