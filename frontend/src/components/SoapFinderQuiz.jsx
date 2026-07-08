import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { API_URL } from '../config';
import { X, Sparkles, Heart, ArrowRight } from 'lucide-react';

const SoapFinderQuiz = ({ isOpen, onClose }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [step, setStep] = useState(1);
  
  // Quiz Answers
  const [skinType, setSkinType] = useState('');
  const [scent, setScent] = useState('');
  const [exfoliation, setExfoliation] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  // Gamification States
  const [showTransition, setShowTransition] = useState(false);
  const [transitionMsg, setTransitionMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Lock body scroll when quiz is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  useEffect(() => {
    // Fetch products to dynamically match user answers
    fetch(`${API_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error loading products for quiz:', err));
  }, []);

  if (!isOpen) return null;

  const handleReset = () => {
    setStep(1);
    setSkinType('');
    setScent('');
    setExfoliation('');
    setRecommendation(null);
    setShowTransition(false);
    setTransitionMsg('');
    setIsLoading(false);
  };

  const getRecommendation = () => {
    if (products.length === 0) return null;

    // Match based on keywords or names
    if (skinType === 'oily' || scent === 'earthy') {
      return products.find(p => p.name.toLowerCase().includes('neem')) || products[0];
    }
    if (skinType === 'dry' || scent === 'sweet') {
      return products.find(p => p.name.toLowerCase().includes('rose')) || products[1] || products[0];
    }
    if (scent === 'mint' || exfoliation === 'deep') {
      return products.find(p => p.name.toLowerCase().includes('mint')) || products[2] || products[0];
    }
    if (skinType === 'sensitive' || scent === 'woody') {
      return products.find(p => p.name.toLowerCase().includes('sandal')) || products[3] || products[0];
    }
    return products.find(p => p.name.toLowerCase().includes('turmeric')) || products[4] || products[0];
  };

  const triggerTransition = (msg, nextAction) => {
    setTransitionMsg(msg);
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      nextAction();
    }, 1800);
  };

  const handleSelectSkinType = (val) => {
    setSkinType(val);
    triggerTransition(
      "Ooh really! Ok, you are good to go! 👍 Let's check... How do you prefer your soap to smell? 🌸",
      () => setStep(2)
    );
  };

  const handleSelectScent = (val) => {
    setScent(val);
    triggerTransition(
      "Perfect choice! You have amazing taste. 🌟 Now, tell me... What level of skin exfoliation scrub do you need? 🧼",
      () => setStep(3)
    );
  };

  const handleSelectExfoliation = (val) => {
    setExfoliation(val);
    triggerTransition(
      "Superb! Matching your answers to our organic botanical formulas... Let's see your perfect match! 🌿🧪",
      () => {
        setIsLoading(true);
        setTimeout(() => {
          const rec = getRecommendation();
          setRecommendation(rec);
          setStep(4);
          setIsLoading(false);
        }, 1200);
      }
    );
  };

  const handleAddToCart = () => {
    if (recommendation) {
      addToCart(recommendation, 1);
      onClose();
    }
  };

  return (
    <div style={overlayStyle} className="animate-fade-in" onClick={onClose}>
      <div style={modalStyle} className="glass-panel animate-slide-up" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: '#4A5D4E' }} />
            <h3 style={titleStyle}>Perfect Soap Finder</h3>
          </div>
          <button style={closeBtn} onClick={onClose} aria-label="Close Quiz">
            <X size={20} />
          </button>
        </div>

        {/* Loading Spinner Screen */}
        {isLoading && (
          <div style={bodyStyle}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '60px 20px' }}>
              <div style={spinnerStyle}></div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#4A5D4E', margin: 0 }}>
                Crafting Your Custom Formula...
              </h4>
              <p style={{ fontSize: '13px', color: '#5E5A57', margin: 0 }}>
                Selecting natural herbs and plant oils for your recipe.
              </p>
            </div>
          </div>
        )}

        {/* Floating Chat Bubble Overlay Popup */}
        {showTransition && (
          <div style={floatingBubbleStyle} className="animate-scale-up">
            <div style={bubbleHeaderStyle}>
              <span style={{ fontSize: '14px' }}>☁️</span>
              <span>Soap Guide</span>
            </div>
            <p style={bubbleTextStyle}>{transitionMsg}</p>
            <div style={cloudTailStyle1}></div>
            <div style={cloudTailStyle2}></div>
          </div>
        )}

        {/* Quiz Steps */}
        {!isLoading && (
          <>
            {/* Step 1: Skin Concern */}
            {step === 1 && (
              <div style={bodyStyle}>
                <div style={progressIndicator}>Question 1 of 3</div>
                <h4 style={questionStyle}>What is your primary skin type or concern?</h4>
                <div style={optionsContainer}>
                  {[
                    { value: 'oily', label: 'Oily & Acne Prone', desc: 'Control excess sebum and breakouts' },
                    { value: 'dry', label: 'Dry & Flaky Skin', desc: 'Needs deep moisture and rich nutrients' },
                    { value: 'sensitive', label: 'Sensitive & Redness Prone', desc: 'Requires extremely gentle Ayurvedic care' },
                    { value: 'normal', label: 'Normal / Balanced Skin', desc: 'Wants healthy daily glow and freshness' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectSkinType(opt.value)}
                      style={optionBtn(skinType === opt.value)}
                    >
                      <span style={optionLabelStyle}>{opt.label}</span>
                      <span style={optionDescStyle}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Scent Preference */}
            {step === 2 && (
              <div style={bodyStyle}>
                <div style={progressIndicator}>Question 2 of 3</div>
                <h4 style={questionStyle}>What aroma profile do you prefer for your skincare?</h4>
                <div style={optionsContainer}>
                  {[
                    { value: 'earthy', label: 'Earthy, Herbal & Clean', desc: 'Natural botanical neem fragrance' },
                    { value: 'sweet', label: 'Sweet, Creamy & Floral', desc: 'Indulgent luxury rose milk absolute' },
                    { value: 'mint', label: 'Cool, Peppermint & Zingy', desc: 'Fresh minty kick to boost energy' },
                    { value: 'woody', label: 'Warm, Meditative Sandalwood', desc: 'Rich woody traditional aroma' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectScent(opt.value)}
                      style={optionBtn(scent === opt.value)}
                    >
                      <span style={optionLabelStyle}>{opt.label}</span>
                      <span style={optionDescStyle}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(1)} style={backBtn}>Back</button>
              </div>
            )}

            {/* Step 3: Exfoliation Needs */}
            {step === 3 && (
              <div style={bodyStyle}>
                <div style={progressIndicator}>Question 3 of 3</div>
                <h4 style={questionStyle}>What level of skin exfoliation do you prefer?</h4>
                <div style={optionsContainer}>
                  {[
                    { value: 'deep', label: 'Deep Exfoliating Loofah', desc: 'Heavy exfoliation embedded in the bar' },
                    { value: 'gentle', label: 'Gentle Toning Polish', desc: 'Mild skin polishing with saffron/turmeric' },
                    { value: 'none', label: 'None / Smooth Lather', desc: 'Creamy soap bar without scrub elements' }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelectExfoliation(opt.value)}
                      style={optionBtn(exfoliation === opt.value)}
                    >
                      <span style={optionLabelStyle}>{opt.label}</span>
                      <span style={optionDescStyle}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} style={backBtn}>Back</button>
              </div>
            )}

            {/* Step 4: Recommendation Results */}
            {step === 4 && recommendation && (
              <div style={bodyStyle}>
                <div style={successHeader}>
                  <Heart size={28} fill="#4A5D4E" color="#4A5D4E" />
                  <h4 style={resultTitleStyle}>Your Perfect Match!</h4>
                  <p style={resultSubStyle}>Based on your answers, here is the ideal organic bar for your routine:</p>
                </div>

                <div style={recommendationCardStyle}>
                  <div style={imgContainer}>
                    <img
                      src={recommendation.images?.[0] || '/assets/neem-soap.png'}
                      alt={recommendation.name}
                      style={cardImgStyle}
                    />
                  </div>
                  <div style={cardContentStyle}>
                    <span style={cardBadgeStyle}>{recommendation.badge}</span>
                    <h5 style={cardTitleStyle}>{recommendation.name}</h5>
                    <p style={cardDescStyle}>{recommendation.description}</p>
                    <div style={cardPriceStyle}>₹{recommendation.price}</div>
                  </div>
                </div>

                <div style={actionRowStyle}>
                  <button onClick={handleReset} style={resetBtn}>Retake Quiz</button>
                  <button onClick={handleAddToCart} style={addToCartBtn}>
                    Add to Cart & Go
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// CSS in JS Styling
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(28, 26, 25, 0.65)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 99999,
  padding: '20px',
  boxSizing: 'border-box',
};

const modalStyle = {
  backgroundColor: '#FFFDF9',
  width: '100%',
  maxWidth: '540px',
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
  overflow: 'visible',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid rgba(74, 93, 78, 0.08)',
  position: 'relative',
};

const headerStyle = {
  padding: '20px 24px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleStyle = {
  fontSize: '18px',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '700',
  color: '#4A5D4E',
  margin: 0,
};

const closeBtn = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: '#A09690',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const bodyStyle = {
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
};

const progressIndicator = {
  fontSize: '11px',
  fontWeight: '700',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  color: '#A06E52',
  marginBottom: '8px',
};

const questionStyle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '20px',
  lineHeight: '1.4',
  marginTop: 0,
};

const optionsContainer = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
};

const optionBtn = (isSelected) => ({
  padding: '16px 20px',
  borderRadius: '16px',
  border: isSelected ? '2px solid #4A5D4E' : '1px solid rgba(74, 93, 78, 0.12)',
  backgroundColor: isSelected ? '#F0F5F1' : '#FFF',
  textAlign: 'left',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  transition: 'all 0.2s ease',
  fontFamily: "'Inter', sans-serif",
  outline: 'none',
});

const optionLabelStyle = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#1C1A19',
};

const optionDescStyle = {
  fontSize: '12.5px',
  color: '#5E5A57',
};

const backBtn = {
  alignSelf: 'flex-start',
  backgroundColor: 'transparent',
  border: 'none',
  color: '#5E5A57',
  fontWeight: '600',
  fontSize: '14px',
  cursor: 'pointer',
  padding: '8px 12px',
};

// Corner Floating Bubble Styles
const floatingBubbleStyle = {
  position: 'absolute',
  top: '-70px',
  right: '-30px',
  width: '230px',
  backgroundColor: '#FFFDF9',
  border: '2.5px solid #4A5D4E',
  borderRadius: '20px 20px 4px 20px',
  padding: '12px 16px',
  boxShadow: '0 12px 30px rgba(74, 93, 78, 0.18), 0 0 15px rgba(255,255,255,0.75)',
  zIndex: 999999,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  boxSizing: 'border-box',
  pointerEvents: 'none',
};

const bubbleHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  fontSize: '10px',
  fontWeight: '800',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  color: '#A06E52',
};

const bubbleTextStyle = {
  fontSize: '12.5px',
  color: '#1C1A19',
  margin: 0,
  lineHeight: '1.4',
  fontWeight: '650',
};

const cloudTailStyle1 = {
  position: 'absolute',
  bottom: '-10px',
  right: '30px',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: '#FFFDF9',
  border: '2px solid #4A5D4E',
  zIndex: 999998,
};

const cloudTailStyle2 = {
  position: 'absolute',
  bottom: '-18px',
  right: '38px',
  width: '6px',
  height: '6px',
  borderRadius: '50%',
  backgroundColor: '#FFFDF9',
  border: '2px solid #4A5D4E',
  zIndex: 999997,
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid rgba(74, 93, 78, 0.1)',
  borderTop: '4px solid #4A5D4E',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const successHeader = {
  textAlign: 'center',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
};

const resultTitleStyle = {
  fontSize: '24px',
  fontFamily: "'Playfair Display', serif",
  color: '#4A5D4E',
  margin: 0,
};

const resultSubStyle = {
  fontSize: '14px',
  color: '#5E5A57',
  margin: 0,
  maxWidth: '380px',
};

const recommendationCardStyle = {
  display: 'flex',
  gap: '20px',
  padding: '20px',
  borderRadius: '20px',
  backgroundColor: '#FFF',
  border: '1px solid rgba(74, 93, 78, 0.08)',
  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
  marginBottom: '24px',
  alignItems: 'center',
};

const imgContainer = {
  width: '120px',
  height: '120px',
  borderRadius: '12px',
  overflow: 'hidden',
  flexShrink: 0,
  border: '1px solid rgba(74, 93, 78, 0.06)',
};

const cardImgStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const cardContentStyle = {
  flex: 1,
};

const cardBadgeStyle = {
  fontSize: '9px',
  fontWeight: '800',
  color: '#A06E52',
  letterSpacing: '0.8px',
  display: 'block',
  marginBottom: '4px',
};

const cardTitleStyle = {
  fontSize: '18px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  margin: '0 0 6px 0',
};

const cardDescStyle = {
  fontSize: '12.5px',
  color: '#5E5A57',
  lineHeight: '1.5',
  margin: '0 0 10px 0',
};

const cardPriceStyle = {
  fontSize: '16px',
  fontWeight: '800',
  color: '#4A5D4E',
};

const actionRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  alignItems: 'center',
};

const resetBtn = {
  backgroundColor: 'transparent',
  color: '#5E5A57',
  border: '1px solid rgba(74, 93, 78, 0.2)',
  padding: '12px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  fontSize: '14.5px',
};

const addToCartBtn = {
  flex: 1,
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  border: 'none',
  padding: '12px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  fontSize: '14.5px',
  boxShadow: '0 8px 20px rgba(74, 93, 78, 0.15)',
};

export default SoapFinderQuiz;
