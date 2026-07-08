import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Star, ShoppingCart, ArrowLeft, Heart, Check, Plus, Minus } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, showToast } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('benefits');
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewEmail, setNewReviewEmail] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');

  const fetchReviews = () => {
    fetch(`${API_URL}/api/feedback?product=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setReviewsLoading(false);
      });
  };

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

    fetchReviews();
  }, [id]);

  const handleQtyChange = (val) => {
    setQuantity(Math.max(1, quantity + val));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newReviewName,
          email: newReviewEmail,
          rating: newReviewRating,
          feedback: newReviewText,
          product: id,
        }),
      });

      if (response.ok) {
        showToast('Thank you! Your product review has been submitted.');
        setNewReviewName('');
        setNewReviewEmail('');
        setNewReviewText('');
        setNewReviewRating(5);
        fetchReviews(); // Reload product reviews
      } else {
        showToast('Failed to submit review.');
      }
    } catch (error) {
      console.error(error);
      showToast('Error connecting to review server.');
    }
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

  const computedRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;
  const computedReviewCount = reviews.length > 0 ? reviews.length : product.reviews;

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
            <div style={starsWrap}>{renderStars(computedRating)}</div>
            <span style={reviewCount}>{computedRating} / 5.0 Rating ({computedReviewCount} customer reviews)</span>
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

      {/* Reviews Section */}
      <ScrollReveal direction="up" duration={0.8}>
        <div style={reviewsSectionStyle} className="product-reviews-section">
          <div style={reviewsHeader}>
            <h2 style={reviewsTitle}>Customer Reviews</h2>
            <div style={avgRatingBox} className="glass-panel">
              <span style={avgRatingNum}>{computedRating}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={starsWrap}>{renderStars(Math.round(computedRating))}</div>
                <span style={avgRatingCount}>Based on {computedReviewCount} reviews</span>
              </div>
            </div>
          </div>

          <div style={reviewsGrid} className="reviews-split-grid">
            {/* Reviews List */}
            <div style={reviewsListCol}>
              {reviewsLoading ? (
                <div style={{ color: '#5E5A57' }}>Loading customer reviews...</div>
              ) : reviews.length === 0 ? (
                <div style={emptyReviewsStyle} className="glass-panel">
                  <p style={{ margin: 0, color: '#5E5A57', fontStyle: 'italic' }}>
                    No customer reviews for this soap yet. Be the first to share your experience!
                  </p>
                </div>
              ) : (
                <div style={reviewsScrollList}>
                  {reviews.map((rev) => (
                    <div key={rev._id} style={reviewCardStyle} className="glass-panel">
                      <div style={reviewCardHeader}>
                        <span style={reviewAuthor}>{rev.name}</span>
                        <span style={reviewStarsStyle}>{renderStars(rev.rating)}</span>
                      </div>
                      <p style={reviewText}>"{rev.feedback}"</p>
                      <span style={reviewDate}>
                        {new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} • Verified Buyer
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add Review Form */}
            <div style={addReviewCol} className="glass-panel">
              <h3 style={addReviewTitle}>Write a Review</h3>
              <form onSubmit={handleReviewSubmit} style={reviewForm}>
                <div style={formRow}>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={reviewLabel}>Your Name</label>
                    <input
                      type="text"
                      required
                      style={reviewInput}
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      placeholder="e.g. Aarav S."
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <label style={reviewLabel}>Email Address</label>
                    <input
                      type="email"
                      required
                      style={reviewInput}
                      value={newReviewEmail}
                      onChange={(e) => setNewReviewEmail(e.target.value)}
                      placeholder="e.g. aarav@gmail.com"
                    />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={reviewLabel}>Soap Rating</label>
                  <select
                     style={reviewInput}
                     value={newReviewRating}
                     onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Very Good)</option>
                    <option value="3">3 Stars (Average)</option>
                    <option value="2">2 Stars (Fair)</option>
                    <option value="1">1 Star (Poor)</option>
                  </select>
                </div>

                <div style={formGroup}>
                  <label style={reviewLabel}>Your Experience</label>
                  <textarea
                    rows="4"
                    required
                    style={reviewTextarea}
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    placeholder="Tell us about the lather, scent, and how it feels on your skin..."
                  />
                </div>

                <button type="submit" style={reviewSubmitBtn}>Submit Soap Review</button>
              </form>
            </div>
          </div>
        </div>
      </ScrollReveal>
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

// Reviews Styles
const reviewsSectionStyle = {
  marginTop: '60px',
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  paddingTop: '40px',
  width: '100%',
};

const reviewsHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '34px',
  flexWrap: 'wrap',
  gap: '20px',
};

const reviewsTitle = {
  fontSize: '28px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  margin: 0,
};

const avgRatingBox = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 24px',
  backgroundColor: '#FFFDF9',
  borderRadius: '16px',
  border: '1px solid rgba(74, 93, 78, 0.08)',
};

const avgRatingNum = {
  fontSize: '36px',
  fontWeight: '900',
  color: '#4A5D4E',
  fontFamily: "'Inter', sans-serif",
  lineHeight: 1,
};

const avgRatingCount = {
  fontSize: '12px',
  color: '#A09690',
  fontWeight: '600',
};

const reviewsGrid = {
  display: 'grid',
  gridTemplateColumns: '1.1fr 0.9fr',
  gap: '40px',
  alignItems: 'start',
};

const reviewsListCol = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const reviewsScrollList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  maxHeight: '520px',
  overflowY: 'auto',
  paddingRight: '10px',
};

const reviewCardStyle = {
  padding: '20px',
  backgroundColor: '#FFFDF9',
  borderRadius: '16px',
  border: '1px solid rgba(74, 93, 78, 0.05)',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.01)',
};

const reviewCardHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '10px',
};

const reviewAuthor = {
  fontWeight: '700',
  color: '#1C1A19',
  fontSize: '15px',
};

const reviewStarsStyle = {
  display: 'flex',
  gap: '2px',
};

const reviewText = {
  fontStyle: 'italic',
  color: '#5E5A57',
  fontSize: '14.5px',
  lineHeight: '1.6',
  marginBottom: '10px',
  marginTop: 0,
};

const reviewDate = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#4A5D4E',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const addReviewCol = {
  padding: '30px',
  backgroundColor: '#FFFDF9',
  borderRadius: '24px',
};

const addReviewTitle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#4A5D4E',
  marginBottom: '20px',
  marginTop: 0,
  fontWeight: '700',
};

const reviewForm = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const formRow = {
  display: 'flex',
  gap: '16px',
  flexWrap: 'wrap',
};

const formGroup = {
  display: 'flex',
  flexDirection: 'column',
};

const reviewLabel = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '750',
  marginBottom: '6px',
  color: '#1C1A19',
};

const reviewInput = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '10px',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: '#FFF',
  fontFamily: "'Inter', sans-serif",
  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.02)',
};

const reviewTextarea = {
  ...reviewInput,
  resize: 'vertical',
};

const reviewSubmitBtn = {
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '15px',
  boxShadow: '0 6px 16px rgba(74, 93, 78, 0.12)',
  transition: 'background-color 0.2s',
  marginTop: '8px',
};

const emptyReviewsStyle = {
  padding: '40px',
  textAlign: 'center',
  borderRadius: '16px',
  backgroundColor: 'rgba(74, 93, 78, 0.02)',
  border: '1px dashed rgba(74, 93, 78, 0.15)',
};

export default ProductDetails;
