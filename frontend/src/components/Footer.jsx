import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <div style={containerStyle}>
        <div style={brandCol}>
          <h3 style={logoStyle}>🍃 Vegan Soap</h3>
          <p style={taglineStyle}>
            Handcrafted organic loofah soaps inspired by ancient Ayurvedic wisdom, designed to soothe and nourish your skin naturally.
          </p>
        </div>

        <div style={linksCol}>
          <h4 style={headingStyle}>Shop & Services</h4>
          <ul style={listStyle}>
            <li><Link to="/shop?category=Face Care" style={linkStyle}>Face Care</Link></li>
            <li><Link to="/shop?category=Body Care" style={linkStyle}>Body Care</Link></li>
            <li><Link to="/shop?category=Foot Care" style={linkStyle}>Foot Care</Link></li>
          </ul>
        </div>

        <div style={linksCol}>
          <h4 style={headingStyle}>Customer Care</h4>
          <ul style={listStyle}>
            <li><Link to="/shop" style={linkStyle}>All Products</Link></li>
            <li><Link to="/dashboard" style={linkStyle}>Order Status</Link></li>
            <li><Link to="/" style={linkStyle}>Support & Feedback</Link></li>
          </ul>
        </div>
      </div>
      
      <div style={copyrightStyle}>
        © {new Date().getFullYear()} Vegan Soap. Crafted with ❤️ for organic skincare. All rights reserved.
      </div>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#FFF',
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  padding: '60px 0 24px',
  marginTop: '80px',
  fontFamily: "'Inter', sans-serif",
};

const containerStyle = {
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '0 24px',
  display: 'grid',
  gridTemplateColumns: '2fr 1fr 1fr',
  gap: '40px',
};

const brandCol = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const logoStyle = {
  fontSize: '22px',
  fontFamily: "'Playfair Display', serif",
  color: '#4A5D4E',
  fontWeight: '800',
};

const taglineStyle = {
  fontSize: '14px',
  color: '#5E5A57',
  maxWidth: '380px',
  lineHeight: '1.7',
};

const linksCol = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const headingStyle = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#1C1A19',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const linkStyle = {
  fontSize: '14px',
  color: '#5E5A57',
  transition: 'color 0.2s',
  ':hover': {
    color: '#4A5D4E',
  }
};

const copyrightStyle = {
  borderTop: '1px solid rgba(74, 93, 78, 0.05)',
  maxWidth: '1300px',
  margin: '40px auto 0',
  padding: '24px 24px 0',
  textAlign: 'center',
  fontSize: '13px',
  color: '#A09690',
};

export default Footer;
