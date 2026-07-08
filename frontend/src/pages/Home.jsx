import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { ArrowRight, Star, Heart, Truck, Landmark, RefreshCw, Sparkles } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import SoapFinderQuiz from '../components/SoapFinderQuiz';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useCart();
  
  // Feedback Form State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [recentFeedbacks, setRecentFeedbacks] = useState([]);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  useEffect(() => {
    // Fetch products
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data.slice(0, 3)); // Display first 3 products
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });

    // Fetch feedbacks
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = () => {
    fetch(`${API_URL}/api/feedback`)
      .then((res) => res.json())
      .then((data) => {
        setRecentFeedbacks(data.slice(0, 4)); // Display latest 4 feedbacks in a grid!
      })
      .catch((err) => console.error('Error fetching feedback:', err));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: feedbackName,
          email: feedbackEmail,
          rating: feedbackRating,
          feedback: feedbackText,
          category: 'General Review',
        }),
      });

      if (response.ok) {
        showToast('Thank you! Your feedback has been submitted.');
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackText('');
        setFeedbackRating(5);
        setIsFeedbackModalOpen(false); // Close modal on success
        fetchFeedbacks(); // Reload testimonials list
      } else {
        showToast('Failed to submit feedback.');
      }
    } catch (error) {
      console.error(error);
      showToast('Error connecting to feedback server.');
    }
  };

  return (
    <div style={pageStyle} className="animate-fade-in">
      {/* Hero Section */}
      <section style={heroSectionStyle}>
        <div style={heroGrid} className="hero-grid">
          <ScrollReveal direction="left" duration={1.0}>
            <div style={heroLeft}>
              <span className="chip" style={{ marginBottom: '16px' }}>Ayurvedic • Herbal • Handmade</span>
              <h1 style={heroHeading}>Natural Loofah Soaps for Glowing, Healthy Skin</h1>
              <p style={heroSub}>
                Vegan Soap brings together plant-powered ingredients, gentle exfoliation, and high-performance skincare to create a pure, toxic-free cleansing ritual.
              </p>
              <div style={quoteCard} className="glass-panel">
                <span style={quoteSign}>“</span>
                <p style={quoteText}>
                  Healthy skin begins with gentle daily care. Cleanse softly, nourish deeply, and let your natural glow radiate from within.
                </p>
              </div>
              <div style={heroBtns}>
                <Link to="/shop" style={btnPrimary}>Shop Collection <ArrowRight size={16} /></Link>
                <button onClick={() => setIsQuizOpen(true)} style={btnHighlight} className="eye-catcher-btn">
                  Perfect Soap Finder <Sparkles size={16} />
                </button>
                <a href="#featured" style={btnSecondary}>View Featured</a>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" duration={1.0} delay={0.2}>
            <div style={heroRight}>
              <div style={heroProductCard} className="glass-panel">
                <div style={heroImgWrap}>
                  <img
                    src="/assets/neem-soap.png"
                    alt="Herbal Glow Neem Soap"
                    style={heroImg}
                  />
                </div>
                <h3 style={heroCardTitle}>Herbal Glow Neem Soap</h3>
                <div style={heroCardPrice}>₹299 • Best Seller</div>
                <p style={heroCardDesc}>
                  A nourishing neem-infused soap with an embedded natural loofah core that sweeps away rough cells and combats environmental stresses.
                </p>
                <Link to="/shop" style={viewFeaturedBtn}>Explore Now</Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values Section */}
      <section style={valuesSection}>
        <ScrollReveal direction="up">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={sectionTitle}>Why Choose Vegan Soap?</h2>
            <p style={sectionSub}>Our commitment to sustainability and authentic skincare recipes.</p>
          </div>
        </ScrollReveal>
        <div style={valuesGrid} className="values-grid">
          <ScrollReveal direction="up" delay={0.0}>
            <div style={valueCard} className="glass-panel">
              <Heart size={32} style={{ color: '#A06E52', marginBottom: '16px' }} />
              <h4>Ayurvedic Roots</h4>
              <p>Formulated with traditional botanical oils, clay powders, and wild herbs to naturally restore your skin's pH balance.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15}>
            <div style={valueCard} className="glass-panel">
              <RefreshCw size={32} style={{ color: '#4A5D4E', marginBottom: '16px' }} />
              <h4>Loofah Exfoliation</h4>
              <p>Embedded with real organic loofah fibers to stimulate blood flow, target rough heels, and gently polish away dryness.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3}>
            <div style={valueCard} className="glass-panel">
              <Truck size={32} style={{ color: '#4A5D4E', marginBottom: '16px' }} />
              <h4>Express Shipping</h4>
              <p>Fast delivery across all pincodes, with free shipping for all orders totaling more than ₹800.</p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.45}>
            <div style={valueCard} className="glass-panel">
              <Landmark size={32} style={{ color: '#A06E52', marginBottom: '16px' }} />
              <h4>Simulated UPI & COD</h4>
              <p>We provide multiple checkout choices, including Cash on Delivery and mock UPI QR scans for convenience.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>



      {/* Featured Collection Grid */}
      <section id="featured" style={featuredSection}>
        <ScrollReveal direction="up">
          <div style={sectionHeadRow}>
            <div>
              <h2 style={sectionTitle}>Our Botanical Soap Collection</h2>
              <p style={sectionSub}>Explore our curated recipes for face, body, and foot care.</p>
            </div>
            <Link to="/shop" style={shopMoreLink}>View All Soaps <ArrowRight size={16} /></Link>
          </div>
        </ScrollReveal>

        {loading ? (
          <div style={loaderStyle}>Nourishing soaps loading...</div>
        ) : (
          <div style={productGridStyle} className="product-grid">
            {featuredProducts.map((product, idx) => (
              <ScrollReveal key={product._id} direction="up" delay={idx * 0.15}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Testimonials and Feedback Section */}
      <section style={testimonialSection}>
        <ScrollReveal direction="up" duration={0.8}>
          <div style={reviewsHeaderRow}>
            <div>
              <h2 style={sectionTitle}>What Our Customers Say</h2>
              <p style={sectionSub}>Real reviews from verified members of the Lather & Leaf community.</p>
            </div>
            <button onClick={() => setIsFeedbackModalOpen(true)} style={writeReviewBtn}>
              ✍️ Write a Review
            </button>
          </div>
          
          {recentFeedbacks.length === 0 ? (
            <div style={emptyReviews} className="glass-panel">
              <p>No customer reviews submitted yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div style={reviewsList} className="reviews-grid">
              {recentFeedbacks.map((item, idx) => (
                <div key={item._id || idx} style={reviewCard} className="glass-panel">
                  <div style={reviewHeader}>
                    <span style={reviewAuthor}>{item.name}</span>
                    <span style={reviewStars}>
                      {Array.from({ length: item.rating }).map((_, i) => '★').join('')}
                      {Array.from({ length: 5 - item.rating }).map((_, i) => '☆').join('')}
                    </span>
                  </div>
                  <p style={reviewText}>"{item.feedback}"</p>
                  <span style={reviewDate}>Verified Customer Review</span>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* Share Experience Modal */}
      {isFeedbackModalOpen && (
        <div style={modalOverlay} className="animate-fade-in">
          <div style={modalContent} className="glass-panel animate-slide-up">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#4A5D4E', margin: 0 }}>
                Share Your Experience
              </h3>
              <button 
                onClick={() => setIsFeedbackModalOpen(false)} 
                style={{ border: 'none', background: 'none', fontSize: '28px', cursor: 'pointer', color: '#A09690', lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: '14px', color: '#5E5A57', marginBottom: '20px', marginTop: 0 }}>
              We value your thoughts! Tell us how Vegan Soap feel on your skin.
            </p>
            <form onSubmit={handleFeedbackSubmit}>
              <div style={rowInput}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Your Name</label>
                  <input
                    type="text"
                    required
                    style={inputStyle}
                    value={feedbackName}
                    onChange={(e) => setFeedbackName(e.target.value)}
                    placeholder="Aarav S."
                  />
                </div>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    required
                    style={inputStyle}
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="aarav@gmail.com"
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Soap Rating</label>
                <select
                  style={inputStyle}
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(Number(e.target.value))}
                >
                  <option value="5">5 Stars (Excellent)</option>
                  <option value="4">4 Stars (Very Good)</option>
                  <option value="3">3 Stars (Average)</option>
                  <option value="2">2 Stars (Fair)</option>
                  <option value="1">1 Star (Poor)</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Your Feedback</label>
                <textarea
                  rows="4"
                  required
                  style={textareaStyle}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Share details about the scent, exfoliation texture, and moisturization..."
                />
              </div>

              <button type="submit" style={submitBtn}>Submit Feedback Review</button>
            </form>
          </div>
        </div>
      )}

      {/* Soap Finder Quiz Modal */}
      <SoapFinderQuiz isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
    </div>
  );
};

// CSS in JS Styling
const pageStyle = {
  paddingTop: '30px',
  fontFamily: "'Inter', sans-serif",
};

const heroSectionStyle = {
  maxWidth: '1300px',
  margin: '0 auto 60px',
  padding: '0 24px',
};

const heroGrid = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '40px',
  alignItems: 'center',
  backgroundColor: '#F5ECE3',
  backgroundImage: 'linear-gradient(135deg, #F5ECE3 0%, #E6ECE7 100%)',
  borderRadius: '28px',
  padding: '60px',
  border: '1px solid rgba(74, 93, 78, 0.05)',
  boxShadow: '0 16px 40px -10px rgba(0, 0, 0, 0.03)',
};

const heroLeft = {
  display: 'flex',
  flexDirection: 'column',
};

const heroHeading = {
  fontSize: '56px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '20px',
  lineHeight: '1.1',
};

const heroSub = {
  fontSize: '18px',
  color: '#5E5A57',
  marginBottom: '26px',
  lineHeight: '1.6',
};

const quoteCard = {
  padding: '20px 24px',
  backgroundColor: 'rgba(255, 255, 255, 0.65)',
  borderLeft: '4px solid #4A5D4E',
  borderRadius: '16px',
  marginBottom: '26px',
  position: 'relative',
};

const quoteSign = {
  position: 'absolute',
  top: '-10px',
  left: '10px',
  fontSize: '48px',
  color: 'rgba(74, 93, 78, 0.12)',
  fontFamily: 'serif',
};

const quoteText = {
  fontSize: '15px',
  fontStyle: 'italic',
  color: '#1C1A19',
  lineHeight: '1.6',
};

const heroBtns = {
  display: 'flex',
  gap: '16px',
};

const btnPrimary = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px 28px',
  borderRadius: '12px',
  fontWeight: '700',
  boxShadow: '0 10px 20px rgba(74, 93, 78, 0.15)',
};

const btnSecondary = {
  display: 'inline-flex',
  alignItems: 'center',
  backgroundColor: 'transparent',
  color: '#1C1A19',
  padding: '14px 28px',
  borderRadius: '12px',
  fontWeight: '700',
  border: '1px solid rgba(74, 93, 78, 0.25)',
};

const btnHighlight = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#EAD8C9',
  color: '#4A5D4E',
  padding: '14px 28px',
  borderRadius: '12px',
  fontWeight: '800',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(234, 216, 201, 0.3)',
};

const heroRight = {
  display: 'flex',
  justifyContent: 'center',
};

const heroProductCard = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  borderRadius: '24px',
  padding: '24px',
  maxWidth: '350px',
  boxShadow: '0 20px 40px rgba(74, 93, 78, 0.08)',
};

const heroImgWrap = {
  height: '240px',
  borderRadius: '16px',
  overflow: 'hidden',
  backgroundColor: '#FFF',
  marginBottom: '18px',
};

const heroImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const heroCardTitle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '6px',
};

const heroCardPrice = {
  fontSize: '15px',
  fontWeight: '800',
  color: '#4A5D4E',
  marginBottom: '10px',
};

const heroCardDesc = {
  fontSize: '13px',
  color: '#5E5A57',
  lineHeight: '1.6',
  marginBottom: '18px',
};

const viewFeaturedBtn = {
  display: 'block',
  textAlign: 'center',
  backgroundColor: '#1C1A19',
  color: '#FFFDF9',
  padding: '12px',
  borderRadius: '10px',
  fontWeight: '700',
  fontSize: '14px',
};

const valuesSection = {
  maxWidth: '1300px',
  margin: '0 auto 80px',
  padding: '0 24px',
};

const sectionTitle = {
  fontSize: '36px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '8px',
};

const sectionSub = {
  fontSize: '16px',
  color: '#5E5A57',
};

const valuesGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '20px',
};

const valueCard = {
  padding: '30px 24px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const featuredSection = {
  maxWidth: '1300px',
  margin: '0 auto 80px',
  padding: '0 24px',
};

const sectionHeadRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  marginBottom: '32px',
};

const shopMoreLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  fontWeight: '700',
  color: '#4A5D4E',
  fontSize: '15px',
};

const loaderStyle = {
  textAlign: 'center',
  padding: '40px',
  fontSize: '16px',
  color: '#5E5A57',
};

const productGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '28px',
};

const testimonialSection = {
  maxWidth: '1300px',
  margin: '0 auto 80px',
  padding: '0 24px',
};

const reviewsHeaderRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  flexWrap: 'wrap',
  gap: '16px',
};

const writeReviewBtn = {
  backgroundColor: 'transparent',
  color: '#4A5D4E',
  border: '2px solid #4A5D4E',
  padding: '10px 20px',
  borderRadius: '10px',
  fontWeight: '700',
  fontSize: '14.5px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: "'Inter', sans-serif",
};

const emptyReviews = {
  padding: '40px',
  textAlign: 'center',
  color: '#5E5A57',
};

const reviewsList = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '24px',
  marginTop: '10px',
};

const reviewCard = {
  padding: '24px',
  backgroundColor: '#FFFDF9',
  borderRadius: '16px',
  border: '1px solid rgba(74, 93, 78, 0.05)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
};

const reviewHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
};

const reviewAuthor = {
  fontWeight: '700',
  color: '#1C1A19',
  fontSize: '15px',
};

const reviewStars = {
  color: '#F4B400',
  fontSize: '14px',
  letterSpacing: '1px',
};

const reviewText = {
  fontStyle: 'italic',
  color: '#5E5A57',
  fontSize: '14px',
  lineHeight: '1.6',
  marginBottom: '10px',
};

const reviewDate = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#4A5D4E',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

// Modal styles
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(28, 26, 25, 0.6)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalContent = {
  backgroundColor: '#FFFDF9',
  width: '100%',
  maxWidth: '500px',
  borderRadius: '20px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  flexDirection: 'column',
  padding: '34px',
  border: '1px solid rgba(74, 93, 78, 0.08)',
};

const rowInput = {
  display: 'flex',
  gap: '16px',
  marginBottom: '16px',
  flexWrap: 'wrap',
};

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: '700',
  marginBottom: '6px',
  color: '#1C1A19',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: '#FFF',
  fontFamily: "'Inter', sans-serif",
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
};

const submitBtn = {
  width: '100%',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px',
  borderRadius: '10px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 6px 16px rgba(74, 93, 78, 0.12)',
};

const quizBannerSection = {
  maxWidth: '1300px',
  margin: '0 auto 80px',
  padding: '0 24px',
};

const quizBannerGrid = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#EAD8C9',
  backgroundImage: 'linear-gradient(135deg, #EAD8C9 0%, #D4E2D7 100%)',
  borderRadius: '24px',
  padding: '40px 60px',
  border: '1px solid rgba(74, 93, 78, 0.05)',
  boxShadow: '0 10px 30px rgba(74, 93, 78, 0.05)',
  flexWrap: 'wrap',
  gap: '30px',
};

const quizBannerLeft = {
  flex: '1 1 350px',
  textAlign: 'left',
};

const quizBannerTitle = {
  fontSize: '28px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '8px',
  marginTop: 0,
};

const quizBannerText = {
  fontSize: '15px',
  color: '#5E5A57',
  margin: 0,
  lineHeight: '1.5',
};

const quizBannerRight = {
  flex: '0 0 auto',
};

const quizBannerBtn = {
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  border: 'none',
  padding: '14px 28px',
  borderRadius: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '15px',
  boxShadow: '0 6px 16px rgba(74, 93, 78, 0.15)',
  transition: 'all 0.3s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
};

export default Home;
