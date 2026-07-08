import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, ArrowLeft, Heart, Check, Plus, Minus } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [id]);

  const handleQtyChange = (val) => {
    setQuantity(Math.max(1, quantity + val));
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < Math.floor(rating);
      return <Star key={i} size={16} fill={isFilled ? '#F4B400' : 'none'} color={isFilled ? '#F4B400' : '#E0DCD9'} />;
    });
  };

  if (loading) {
    return <div style={containerStyle}><div style={loaderStyle}>Loading soap formula...</div></div>;
  }

  if (!product) {
    return (
      <div style={containerStyle} className="glass-panel">
        <div style={errorStyle}>
          <h2>Product Not Found</h2>
          <p>We couldn't load the requested botanical soap details.</p>
          <Link to="/shop" style={btnPrimary}>Back to Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="animate-fade-in">
      {/* Back Link */}
      <ScrollReveal direction="left">
        <Link to="/shop" style={backLinkStyle}>
          <ArrowLeft size={16} />
          Back to Collection
        </Link>
      </ScrollReveal>

      <div style={detailsGridStyle} className="details-grid">
        {/* Left Side: Product Image */}
        <ScrollReveal direction="left" duration={0.8}>
          <div style={leftColStyle}>
            <div style={mainImgContainer} className="glass-panel">
              <img src={product.images?.[0]} alt={product.name} style={mainImg} />
            </div>
          </div>
        </ScrollReveal>

        {/* Right Side: Product Details */}
        <ScrollReveal direction="right" duration={0.8} style={{ width: '100%' }}>
          <div style={rightColStyle}>
            {product.badge && <span className="chip" style={{ width: 'fit-content', marginBottom: '14px' }}>{product.badge}</span>}
          
          <h1 style={titleStyle}>{product.name}</h1>
          
          <div style={metaRow}>
            <span>Category: <strong>{product.category}</strong></span>
            <span>Weight: <strong>{product.weight}</strong></span>
          </div>

          {/* Rating */}
          <div style={ratingRow}>
            <div style={starsWrap}>{renderStars(product.rating)}</div>
            <span style={reviewCount}>{product.rating} / 5.0 Rating ({product.reviews} customer reviews)</span>
          </div>

          {/* Pricing */}
          <div style={priceRow}>
            <span style={priceStyle}>₹{product.price}</span>
            {product.oldPrice && <span style={oldPriceStyle}>₹{product.oldPrice}</span>}
            <span style={gstStyle}>Inclusive of all taxes</span>
          </div>

          <p style={descStyle}>{product.description}</p>

          {/* Quantity and Add to Cart Section */}
          <div style={actionsRowStyle}>
            <div style={qtyControls}>
              <button style={qtyBtn} onClick={() => handleQtyChange(-1)}>
                <Minus size={16} />
              </button>
              <span style={qtyText}>{quantity}</span>
              <button style={qtyBtn} onClick={() => handleQtyChange(1)}>
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              style={cartBtnStyle}
            >
              <ShoppingCart size={18} />
              Add {quantity} to Shopping Bag
            </button>
          </div>

          {/* Scent & Skin Profile Chips */}
          <div style={profileArea} className="glass-panel">
            <div style={profileItem}>
              <span style={profileLabel}>Scent Profile</span>
              <span style={profileVal}>🌿 {product.fragrance}</span>
            </div>
            <div style={{ ...profileItem, borderLeft: '1px solid rgba(74, 93, 78, 0.08)' }}>
              <span style={profileLabel}>Skin Compatibility</span>
              <span style={profileVal}>✨ {product.skinType}</span>
            </div>
          </div>

          {/* Dynamic Tabs (Benefits, How to Use, Formula about) */}
          <div style={tabContainerStyle}>
            <div style={tabHeaderStyle}>
              <button
                style={activeTab === 'benefits' ? activeTabStyle : tabBtnStyle}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits & Ingredients
              </button>
              <button
                style={activeTab === 'howToUse' ? activeTabStyle : tabBtnStyle}
                onClick={() => setActiveTab('howToUse')}
              >
                How to Cleanse
              </button>
              <button
                style={activeTab === 'about' ? activeTabStyle : tabBtnStyle}
                onClick={() => setActiveTab('about')}
              >
                Brand Story
              </button>
            </div>

            <div style={tabContentStyle} className="glass-panel">
              {activeTab === 'benefits' && (
                <ul style={listStyle}>
                  {product.benefits?.map((benefit, i) => (
                    <li key={i} style={listItemStyle}>
                      <Check size={16} style={{ color: '#4A5D4E', flexShrink: 0 }} />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'howToUse' && (
                <ol style={numberedListStyle}>
                  {product.howToUse?.map((step, i) => (
                    <li key={i} style={numberedItemStyle}>
                      <span style={stepNumber}>{i + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}

              {activeTab === 'about' && (
                <p style={aboutText}>{product.about}</p>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
      </div>
    </div>
  );
};

// CSS in JS Styling
const containerStyle = {
  maxWidth: '1200px',
  margin: '40px auto',
  padding: '0 24px',
  fontFamily: "'Inter', sans-serif",
};

const loaderStyle = {
  textAlign: 'center',
  padding: '100px 0',
  fontSize: '16px',
  color: '#5E5A57',
};

const backLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '700',
  color: '#5E5A57',
  fontSize: '14px',
  marginBottom: '30px',
};

const detailsGridStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '50px',
};

const leftColStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const mainImgContainer = {
  height: '500px',
  borderRadius: '24px',
  overflow: 'hidden',
  backgroundColor: '#FFF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const mainImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const rightColStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const titleStyle = {
  fontSize: '44px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '10px',
  fontWeight: '700',
};

const metaRow = {
  display: 'flex',
  gap: '24px',
  fontSize: '14px',
  color: '#5E5A57',
  marginBottom: '16px',
};

const ratingRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '24px',
};

const starsWrap = {
  display: 'flex',
  alignItems: 'center',
  gap: '2px',
};

const reviewCount = {
  fontSize: '14px',
  color: '#A09690',
  fontWeight: '600',
};

const priceRow = {
  display: 'flex',
  alignItems: 'baseline',
  gap: '12px',
  marginBottom: '24px',
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  paddingTop: '18px',
};

const priceStyle = {
  fontSize: '32px',
  fontWeight: '850',
  color: '#4A5D4E',
};

const oldPriceStyle = {
  fontSize: '18px',
  textDecoration: 'line-through',
  color: '#A09690',
};

const gstStyle = {
  fontSize: '12px',
  color: '#A09690',
  fontWeight: '600',
  marginLeft: '10px',
};

const descStyle = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: '#5E5A57',
  marginBottom: '30px',
};

const actionsRowStyle = {
  display: 'flex',
  gap: '20px',
  marginBottom: '30px',
};

const qtyControls = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(74, 93, 78, 0.25)',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#FFF',
};

const qtyBtn = {
  border: 'none',
  background: 'none',
  padding: '12px 16px',
  cursor: 'pointer',
  color: '#4A5D4E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const qtyText = {
  padding: '0 12px',
  fontSize: '16px',
  fontWeight: '800',
  color: '#1C1A19',
};

const cartBtnStyle = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '16px 24px',
  borderRadius: '12px',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(74, 93, 78, 0.15)',
};

const profileArea = {
  display: 'flex',
  backgroundColor: '#F7ECE3',
  backgroundImage: 'linear-gradient(135deg, #F9F2EB 0%, #EFF4F0 100%)',
  padding: '18px 24px',
  borderRadius: '16px',
  marginBottom: '34px',
};

const profileItem = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  padding: '0 12px',
};

const profileLabel = {
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: '#A06E52',
  letterSpacing: '0.8px',
};

const profileVal = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#1C1A19',
};

const tabContainerStyle = {
  marginTop: '20px',
};

const tabHeaderStyle = {
  display: 'flex',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  marginBottom: '16px',
};

const tabBtnStyle = {
  border: 'none',
  background: 'none',
  padding: '12px 20px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '700',
  color: '#5E5A57',
  fontFamily: "'Inter', sans-serif",
  position: 'relative',
};

const activeTabStyle = {
  ...tabBtnStyle,
  color: '#4A5D4E',
  fontWeight: '800',
};

const tabContentStyle = {
  padding: '24px',
  backgroundColor: '#FFFDF9',
  borderRadius: '16px',
};

const listStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '14px',
  color: '#5E5A57',
};

const numberedListStyle = {
  listStyle: 'none',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
};

const numberedItemStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  fontSize: '14px',
  color: '#5E5A57',
  lineHeight: '1.6',
};

const stepNumber = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  fontSize: '12px',
  fontWeight: '800',
  flexShrink: 0,
};

const aboutText = {
  fontSize: '14px',
  lineHeight: '1.7',
  color: '#5E5A57',
};

const errorStyle = {
  textAlign: 'center',
  padding: '60px 20px',
};

const btnPrimary = {
  display: 'inline-block',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '12px 24px',
  borderRadius: '10px',
  fontWeight: '700',
  marginTop: '20px',
};

export default ProductDetails;
