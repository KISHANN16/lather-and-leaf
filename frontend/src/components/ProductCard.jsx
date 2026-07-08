import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
      if (i < floorRating) {
        stars.push(<Star key={i} size={14} fill="#F4B400" color="#F4B400" />);
      } else {
        stars.push(<Star key={i} size={14} color="#E0DCD9" />);
      }
    }
    return stars;
  };

  return (
    <div style={cardStyle} className="glass-panel animate-fade-in">
      {/* Badge */}
      {product.badge && (
        <span style={badgeStyle}>
          {product.badge}
        </span>
      )}

      {/* Product Image Area */}
      <Link to={`/product/${product._id}`} style={imgLinkStyle}>
        <div style={imgContainerStyle}>
          <img
            src={product.images?.[0] || '/assets/neem-soap.png'}
            alt={product.name}
            style={imgStyle}
            className="product-card-img"
          />
        </div>
      </Link>

      {/* Content */}
      <div style={contentStyle}>
        <div style={metaRowStyle}>
          <span style={categoryStyle}>{product.category}</span>
          <span style={skinTypeStyle}>{product.skinType.split('/')[0]}</span>
        </div>

        <Link to={`/product/${product._id}`} style={titleLinkStyle}>
          <h3 style={titleStyle}>{product.name}</h3>
        </Link>

        {/* Rating */}
        <div style={ratingRowStyle}>
          <div style={starsStyle}>{renderStars(product.rating)}</div>
          <span style={reviewCountStyle}>({product.reviews})</span>
        </div>

        {/* Short Description */}
        <p style={descStyle}>{product.description}</p>

        {/* Bottom Pricing & Actions */}
        <div style={bottomRowStyle}>
          <div style={priceAreaStyle}>
            <span style={priceStyle}>₹{product.price}</span>
            {product.oldPrice && (
              <span style={oldPriceStyle}>₹{product.oldPrice}</span>
            )}
          </div>
          
          <div style={actionsGroup}>
            <Link to={`/product/${product._id}`} style={viewBtn} title="View Details">
              <Eye size={16} />
            </Link>
            
            <button
              onClick={() => addToCart(product, 1)}
              style={cartBtn}
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// CSS in JS for Premium Layout
const cardStyle = {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
};

const badgeStyle = {
  position: 'absolute',
  top: '14px',
  left: '14px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '6px 12px',
  borderRadius: '8px',
  fontSize: '10px',
  fontWeight: '800',
  letterSpacing: '0.8px',
  zIndex: 10,
};

const imgLinkStyle = {
  display: 'block',
  overflow: 'hidden',
};

const imgContainerStyle = {
  height: '240px',
  backgroundColor: '#FFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  borderBottom: '1px solid rgba(74, 93, 78, 0.05)',
};

const imgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.5s ease',
};

const contentStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
};

const metaRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const categoryStyle = {
  color: '#accent',
  color: '#A06E52',
};

const skinTypeStyle = {
  color: '#5E5A57',
};

const titleLinkStyle = {
  marginBottom: '8px',
};

const titleStyle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  fontWeight: '700',
};

const ratingRowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  marginBottom: '10px',
};

const starsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
};

const reviewCountStyle = {
  fontSize: '12px',
  color: '#A09690',
  fontWeight: '600',
};

const descStyle = {
  fontSize: '13px',
  color: '#5E5A57',
  lineHeight: '1.6',
  marginBottom: '18px',
  flex: 1,
};

const bottomRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: 'auto',
  borderTop: '1px solid rgba(74, 93, 78, 0.05)',
  paddingTop: '14px',
};

const priceAreaStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const priceStyle = {
  fontSize: '18px',
  fontWeight: '800',
  color: '#4A5D4E',
  fontFamily: "'Inter', sans-serif",
};

const oldPriceStyle = {
  fontSize: '14px',
  textDecoration: 'line-through',
  color: '#A09690',
};

const actionsGroup = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const actionBtnBase = {
  border: 'none',
  padding: '10px',
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

const viewBtn = {
  ...actionBtnBase,
  backgroundColor: 'transparent',
  color: '#5E5A57',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  ':hover': {
    backgroundColor: '#FFF',
    borderColor: '#4A5D4E',
    color: '#4A5D4E',
  }
};

const cartBtn = {
  ...actionBtnBase,
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  boxShadow: '0 4px 10px rgba(74, 93, 78, 0.12)',
  ':hover': {
    backgroundColor: '#354338',
  }
};

export default ProductCard;
