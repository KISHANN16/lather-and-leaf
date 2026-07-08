import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Search, User, LogOut, ShieldAlert } from 'lucide-react';

const Navbar = ({ onCartToggle }) => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const [searchVal, setSearchVal] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      {/* Announcement Bar */}
      <div style={announcementStyle}>
        🌿 AYURVEDIC ESSENCE • VEGAN & ORGANIC SOAPS • FREE SHIPPING ABOVE ₹800
      </div>

      {/* Main Header Nav */}
      <header style={headerStyle} className="main-header">
        <div style={containerStyle} className="nav-container">
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <span style={logoSymbol}>🍃</span>
            <span style={logoText}>Vegan Soap</span>
          </Link>

          {/* Search Box */}
          <form onSubmit={handleSearch} style={searchFormStyle} className="nav-search-form">
            <input
              type="text"
              placeholder="Search botanical soaps..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={searchInputStyle}
            />
            <button type="submit" style={searchBtnStyle}>
              <Search size={18} />
            </button>
          </form>

          {/* Navigation Links */}
          <nav style={navStyle} className="nav-links-menu">
            <Link to="/" style={location.pathname === '/' ? activeLinkStyle : linkStyle}>Home</Link>
            <Link to="/shop" style={location.pathname === '/shop' ? activeLinkStyle : linkStyle}>Shop</Link>
            
            {user && (
              <Link to="/dashboard" style={location.pathname === '/dashboard' ? activeLinkStyle : linkStyle}>
                My Orders
              </Link>
            )}

            {user && user.role === 'admin' && (
              <Link to="/admin" style={adminLinkStyle}>
                <ShieldAlert size={15} style={{ marginRight: '4px' }} />
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Action Icons */}
          <div style={actionsStyle} className="nav-actions">
            {user ? (
              <div style={profileWidget}>
                <span style={welcomeText}>Hello, {user.name.split(' ')[0]}</span>
                <button onClick={logout} style={logoutBtnStyle} title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" style={loginBtnStyle}>
                <User size={16} />
                Login
              </Link>
            )}

            {/* Cart Button */}
            <button onClick={onCartToggle} style={cartBtnStyle}>
              <ShoppingBag size={20} />
              {cartCount > 0 && <span style={cartBadgeStyle}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

// Inline CSS Styles for Luxury Aesthetics
const announcementStyle = {
  backgroundColor: '#1C1A19',
  color: '#FFFDF9',
  textAlign: 'center',
  padding: '10px 16px',
  fontSize: '12px',
  letterSpacing: '1.5px',
  fontWeight: '700',
  fontFamily: "'Inter', sans-serif",
};

const headerStyle = {
  backgroundColor: 'rgba(255, 253, 249, 0.92)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 1000,
  transition: 'all 0.3s ease',
};

const containerStyle = {
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '16px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
};

const logoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textDecoration: 'none',
};

const logoSymbol = {
  fontSize: '24px',
};

const logoText = {
  fontSize: '22px',
  fontWeight: '800',
  fontFamily: "'Playfair Display', serif",
  color: '#4A5D4E',
  letterSpacing: '-0.3px',
};

const searchFormStyle = {
  flex: 1,
  maxWidth: '320px',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#FFF',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '9999px',
  padding: '6px 14px',
  boxShadow: '0 4px 10px rgba(74, 93, 78, 0.02)',
};

const searchInputStyle = {
  border: 'none',
  outline: 'none',
  width: '100%',
  fontSize: '14px',
  fontFamily: "'Inter', sans-serif",
  backgroundColor: 'transparent',
};

const searchBtnStyle = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#4A5D4E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '24px',
};

const linkStyle = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#5E5A57',
  fontFamily: "'Inter', sans-serif",
};

const activeLinkStyle = {
  ...linkStyle,
  color: '#4A5D4E',
  fontWeight: '700',
  position: 'relative',
};

const adminLinkStyle = {
  ...linkStyle,
  color: '#b23b3b',
  backgroundColor: '#FFF0F0',
  padding: '6px 12px',
  borderRadius: '8px',
  display: 'inline-flex',
  alignItems: 'center',
  border: '1px solid rgba(178, 59, 59, 0.1)',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const profileWidget = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const welcomeText = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#1C1A19',
  fontFamily: "'Inter', sans-serif",
};

const logoutBtnStyle = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#5E5A57',
  padding: '6px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'background 0.2s',
  ':hover': {
    backgroundColor: 'rgba(74, 93, 78, 0.08)',
  }
};

const loginBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '14px',
  fontWeight: '700',
  color: '#FFFDF9',
  backgroundColor: '#4A5D4E',
  padding: '10px 18px',
  borderRadius: '10px',
  boxShadow: '0 4px 10px rgba(74, 93, 78, 0.12)',
};

const cartBtnStyle = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#4A5D4E',
  position: 'relative',
  padding: '8px',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF',
  border: '1px solid rgba(74, 93, 78, 0.08)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.03)',
  transition: 'all 0.2s',
};

const cartBadgeStyle = {
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  backgroundColor: '#EAD8C9',
  color: '#4A5D4E',
  fontSize: '11px',
  fontWeight: '800',
  borderRadius: '50%',
  width: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1.5px solid #FFFDF9',
};

export default Navbar;
