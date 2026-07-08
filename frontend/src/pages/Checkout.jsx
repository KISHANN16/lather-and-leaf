import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, Landmark, QrCode, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Checkout = () => {
  const { cartItems, itemsTotal, deliveryCharge, totalPrice, clearCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { user, token, updateAddress, logout } = useAuth();
  
  const navigate = useNavigate();

  // Step state: 'address' or 'payment' or 'success'
  const [step, setStep] = useState('address');

  // Address form fields
  const [fullName, setFullName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment form fields
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [latestOrder, setLatestOrder] = useState(null);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleClaimCoupon = (code) => {
    setCouponError('');
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user && !token) {
      navigate('/login?redirect=checkout');
    }
  }, [user, token, navigate]);

  // Load user default address if exists
  useEffect(() => {
    if (user && user.address) {
      const addr = user.address;
      setFullName(addr.fullName || '');
      setAddress1(addr.address1 || '');
      setAddress2(addr.address2 || '');
      setStreet(addr.street || '');
      setCity(addr.city || '');
      setState(addr.state || '');
      setPincode(addr.pincode || '');
      setPhone(addr.phone || '');
    }
  }, [user]);

  // If cart is empty and we are not in success step, redirect to shop
  useEffect(() => {
    if (cartItems.length === 0 && step !== 'success') {
      navigate('/shop');
    }
  }, [cartItems, step, navigate]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !address1 || !city || !state || !pincode || !phone) {
      alert('Please fill in all required address fields.');
      return;
    }
    
    // Save address to user profile in backend if logged in
    if (user) {
      try {
        await updateAddress({
          fullName,
          address1,
          address2,
          street,
          city,
          state,
          pincode,
          phone,
        });
      } catch (err) {
        console.error('Failed to sync address with account:', err);
      }
    }

    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        product: item.product,
      })),
      shippingAddress: {
        fullName,
        address1,
        address2,
        street,
        city,
        state,
        pincode,
        phone,
      },
      paymentMethod,
      itemsPrice: itemsTotal,
      deliveryPrice: deliveryCharge,
      totalPrice: totalPrice,
    };

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.status === 401) {
        logout();
        navigate('/login?redirect=checkout');
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      setLatestOrder(data);
      clearCart();
      setStep('success');
    } catch (error) {
      alert(error.message || 'Checkout failed. Please login first.');
      if (!user && error.message !== 'Session expired. Please log in again.') {
        navigate('/login?redirect=checkout');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={containerStyle} className="container animate-fade-in">
      {step !== 'success' && (
        <div style={stepsIndicator}>
          <div style={step === 'address' ? activeStepTab : inactiveStepTab}>
            <span style={stepNum}>1</span> Shipping Address
          </div>
          <div style={arrowDivider}>→</div>
          <div style={step === 'payment' ? activeStepTab : inactiveStepTab}>
            <span style={stepNum}>2</span> Payment Method
          </div>
        </div>
      )}

      {step === 'address' && (
        <div style={checkoutGrid} className="checkout-grid">
          {/* Address Form */}
          <ScrollReveal direction="left" duration={0.8}>
            <div style={leftCol} className="glass-panel">
              <h2 style={formTitle}>Delivery Details</h2>
              <form onSubmit={handleAddressSubmit}>
                <div style={formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Full Name *</label>
                    <input type="text" required style={inputStyle} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Aarav Sharma" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Phone Number *</label>
                    <input type="text" required style={inputStyle} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" />
                  </div>
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Flat/House No., Building Name *</label>
                  <input type="text" required style={inputStyle} value={address1} onChange={(e) => setAddress1(e.target.value)} placeholder="Flat 402, Green Glen Apartments" />
                </div>

                <div style={formGroup}>
                  <label style={labelStyle}>Street Name, Area, Colony</label>
                  <input type="text" style={inputStyle} value={address2} onChange={(e) => setAddress2(e.target.value)} placeholder="Outer Ring Road" />
                </div>

                <div style={formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Landmark (Optional)</label>
                    <input type="text" style={inputStyle} value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Near HDFC Bank" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Pincode *</label>
                    <input type="text" required style={inputStyle} value={pincode} onChange={(e) => setPincode(e.target.value)} placeholder="400001" />
                  </div>
                </div>

                <div style={formRow}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>City *</label>
                    <input type="text" required style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>State *</label>
                    <input type="text" required style={inputStyle} value={state} onChange={(e) => setState(e.target.value)} placeholder="Maharashtra" />
                  </div>
                </div>

                <button type="submit" style={actionBtn}>
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </ScrollReveal>

          {/* Cart Summary Side */}
          <ScrollReveal direction="right" duration={0.8} style={{ width: '100%' }}>
            <div style={rightCol} className="glass-panel">
              <h2 style={summaryTitle}>Order Summary</h2>
              <div style={itemsList}>
                {cartItems.map((item) => (
                  <div key={item.product} style={summaryCard}>
                    <span>{item.quantity} × {item.name}</span>
                    <strong>₹{item.price * item.quantity}</strong>
                  </div>
                ))}
              </div>

              {/* Coupon Application Box */}
              <div style={couponBoxStyle}>
                <h4 style={couponBoxTitle}>Have a Coupon?</h4>
                {appliedCoupon ? (
                  <div style={couponAppliedRow}>
                    <span style={couponBadgeStyle}>🏷️ {appliedCoupon} Applied</span>
                    <button type="button" onClick={removeCoupon} style={couponRemoveBtn}>Remove</button>
                  </div>
                ) : (
                  <div style={couponInputRow}>
                    <input
                      type="text"
                      placeholder="Enter code (e.g. FREESHIP500)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={couponInputStyle}
                    />
                    <button type="button" onClick={handleApplyCoupon} style={couponApplyBtn}>Apply</button>
                  </div>
                )}
                {couponError && <p style={couponErrorStyle}>{couponError}</p>}
                {!appliedCoupon && itemsTotal >= 500 && itemsTotal < 800 && (
                  <div style={couponSuggestionStyle}>
                    💡 <button type="button" onClick={() => handleClaimCoupon('FREESHIP500')} style={couponSuggestionBtn}>Claim Free Shipping Coupon</button> for orders above ₹500!
                  </div>
                )}
              </div>

              <div style={totalsArea}>
                <div style={totalRow}>
                  <span>Subtotal</span>
                  <span>₹{itemsTotal}</span>
                </div>
                <div style={totalRow}>
                  <span>Shipping Fee</span>
                  <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
                </div>
                <div style={finalTotalRow}>
                  <span>Final Price</span>
                  <span>₹{totalPrice}</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      )}

      {step === 'payment' && (
        <div style={checkoutGrid} className="checkout-grid">
          {/* Payment Options Selection */}
          <div style={leftCol} className="glass-panel">
            <h2 style={formTitle}>Choose Payment Method</h2>
            
            <div style={paymentOptions}>
              <label style={paymentOptionLabel(paymentMethod === 'cod')}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  style={radioInput}
                />
                <div style={optionInfo}>
                  <strong>Cash on Delivery (COD)</strong>
                  <p>Pay in cash or simulated scan at the time of delivery.</p>
                </div>
              </label>

              <label style={paymentOptionLabel(paymentMethod === 'gpay')}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'gpay'}
                  onChange={() => setPaymentMethod('gpay')}
                  style={radioInput}
                />
                <div style={optionInfo}>
                  <strong>UPI Scan: Google Pay / PhonePe</strong>
                  <p>Scan a mock QR code to complete payments instantly.</p>
                </div>
              </label>
            </div>

            {/* If UPI scan is selected, show mock QR code */}
            {paymentMethod === 'gpay' && (
              <div style={qrContainerStyle} className="glass-panel">
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#4A5D4E', marginBottom: '10px' }}>
                  Simulated Payment QR Code
                </h3>
                <p style={{ fontSize: '13px', color: '#5E5A57', marginBottom: '16px' }}>
                  Scan this QR code with any UPI app to simulate paying <strong>₹{totalPrice}</strong>.
                </p>
                <div style={qrWrapper}>
                  {/* Since upi-qr.jpeg is in desktop directory, we can simulate a QR code or use a placeholder */}
                  <div style={mockQrCode}>
                    <QrCode size={120} color="#4A5D4E" />
                    <span style={{ fontSize: '12px', fontWeight: '800', marginTop: '10px', color: '#4A5D4E' }}>UPI ID: merchant@vegansoap</span>
                  </div>
                </div>
                <div style={qrTip}>
                  After completing the transfer in your application, click the button below to confirm your order.
                </div>
              </div>
            )}

            <div style={btnRow}>
              <button onClick={() => setStep('address')} style={backBtn}>
                <ArrowLeft size={16} /> Back to Address
              </button>
              
              <button onClick={handlePlaceOrder} disabled={submitting} style={actionBtn}>
                {submitting ? 'Confirming Order...' : `Pay & Place Order (₹${totalPrice})`}
              </button>
            </div>
          </div>

          {/* Cart Summary Side */}
          <div style={rightCol} className="glass-panel">
            <h2 style={summaryTitle}>Order Summary</h2>
            <div style={shippingPreview}>
              <h4>Deliver To:</h4>
              <p><strong>{fullName}</strong></p>
              <p>{address1}, {address2}</p>
              <p>{city}, {state} - {pincode}</p>
            </div>

            {/* Coupon Application Box */}
            <div style={couponBoxStyle}>
              <h4 style={couponBoxTitle}>Have a Coupon?</h4>
              {appliedCoupon ? (
                <div style={couponAppliedRow}>
                  <span style={couponBadgeStyle}>🏷️ {appliedCoupon} Applied</span>
                  <button type="button" onClick={removeCoupon} style={couponRemoveBtn}>Remove</button>
                </div>
              ) : (
                <div style={couponInputRow}>
                  <input
                    type="text"
                    placeholder="Enter code (e.g. FREESHIP500)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    style={couponInputStyle}
                  />
                  <button type="button" onClick={handleApplyCoupon} style={couponApplyBtn}>Apply</button>
                </div>
              )}
              {couponError && <p style={couponErrorStyle}>{couponError}</p>}
              {!appliedCoupon && itemsTotal >= 500 && itemsTotal < 800 && (
                <div style={couponSuggestionStyle}>
                  💡 <button type="button" onClick={() => handleClaimCoupon('FREESHIP500')} style={couponSuggestionBtn}>Claim Free Shipping Coupon</button> for orders above ₹500!
                </div>
              )}
            </div>

            <div style={totalsArea}>
              <div style={finalTotalRow}>
                <span>Order Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 'success' && latestOrder && (
        <div style={successBoxStyle} className="glass-panel animate-fade-in">
          <div style={successIconWrap}>
            <ShieldCheck size={48} color="#FFF" />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#4A5D4E', marginBottom: '10px' }}>
            Order Placed Successfully!
          </h1>
          <p style={{ fontSize: '16px', color: '#5E5A57', marginBottom: '24px' }}>
            Thank you for shopping with Vegan Soap. Your order has been registered in our database.
          </p>

          <div style={orderReceipt} className="glass-panel">
            <h3>Order Details</h3>
            <div style={receiptRow}>
              <span>Tracking ID:</span>
              <strong>{latestOrder.orderId}</strong>
            </div>
            <div style={receiptRow}>
              <span>Payment Type:</span>
              <strong>{latestOrder.paymentMethod.toUpperCase()}</strong>
            </div>
            <div style={receiptRow}>
              <span>Total Price:</span>
              <strong>₹{latestOrder.totalPrice}</strong>
            </div>
            <div style={receiptRow}>
              <span>Delivery Status:</span>
              <span style={{ color: '#A06E52', fontWeight: '800' }}>{latestOrder.orderStatus}</span>
            </div>
          </div>

          <div style={successBtns}>
            <Link to="/shop" style={btnPrimary}>Continue Shopping</Link>
            <Link to="/dashboard" style={btnSecondary}>Track My Orders</Link>
          </div>
        </div>
      )}
    </div>
  );
};

// Inline CSS styles
const containerStyle = {
  paddingTop: '30px',
  fontFamily: "'Inter', sans-serif",
};

const stepsIndicator = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  marginBottom: '34px',
};

const activeStepTab = {
  fontSize: '15px',
  fontWeight: '800',
  color: '#4A5D4E',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const inactiveStepTab = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#A09690',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
};

const stepNum = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: '#EAD8C9',
  color: '#4A5D4E',
  fontSize: '12px',
  fontWeight: '800',
};

const arrowDivider = {
  color: '#A09690',
  fontWeight: '800',
};

const checkoutGrid = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 0.8fr',
  gap: '30px',
};

const leftCol = {
  padding: '34px',
  backgroundColor: '#FFFDF9',
};

const rightCol = {
  padding: '34px',
  backgroundColor: '#FFFDF9',
  alignSelf: 'start',
};

const formTitle = {
  fontSize: '24px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '24px',
  fontWeight: '700',
};

const summaryTitle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '20px',
  fontWeight: '700',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  paddingBottom: '12px',
};

const formRow = {
  display: 'flex',
  gap: '20px',
  marginBottom: '16px',
  flexWrap: 'wrap',
};

const formGroup = {
  marginBottom: '16px',
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
  padding: '12px 14px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  outline: 'none',
  fontSize: '14px',
  backgroundColor: '#FFF',
  fontFamily: "'Inter', sans-serif",
};

const actionBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '16px',
  borderRadius: '12px',
  border: 'none',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 24px rgba(74, 93, 78, 0.15)',
  marginTop: '16px',
};

const itemsList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  marginBottom: '20px',
};

const summaryCard = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#5E5A57',
};

const totalsArea = {
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  paddingTop: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#5E5A57',
};

const finalTotalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: '800',
  fontSize: '18px',
  color: '#4A5D4E',
  borderTop: '1px solid rgba(74, 93, 78, 0.05)',
  paddingTop: '10px',
};

const shippingPreview = {
  marginBottom: '20px',
  fontSize: '14px',
  color: '#5E5A57',
  lineHeight: '1.6',
};

const paymentOptions = {
  display: 'flex',
  flexDirection: 'column',
  gap: '14px',
  marginBottom: '24px',
};

const paymentOptionLabel = (isActive) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '18px',
  borderRadius: '14px',
  border: isActive ? '2px solid #4A5D4E' : '1px solid rgba(74, 93, 78, 0.15)',
  backgroundColor: isActive ? '#F0F5F1' : '#FFF',
  cursor: 'pointer',
  transition: 'all 0.2s',
});

const radioInput = {
  accentColor: '#4A5D4E',
  marginTop: '4px',
};

const optionInfo = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
};

const qrContainerStyle = {
  padding: '24px',
  backgroundColor: '#FFFDF9',
  textAlign: 'center',
  marginBottom: '24px',
};

const qrWrapper = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '16px',
};

const mockQrCode = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#FFF',
  borderRadius: '16px',
  border: '1px solid rgba(74, 93, 78, 0.12)',
};

const qrTip = {
  fontSize: '12px',
  color: '#A06E52',
  fontWeight: '600',
};

const btnRow = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  marginTop: '20px',
};

const backBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '14px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(74, 93, 78, 0.25)',
  backgroundColor: 'transparent',
  fontWeight: '700',
  color: '#1C1A19',
  cursor: 'pointer',
};

const successBoxStyle = {
  maxWidth: '600px',
  margin: '60px auto',
  padding: '48px',
  textAlign: 'center',
  backgroundColor: '#FFFDF9',
};

const successIconWrap = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#4A5D4E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 24px',
  boxShadow: '0 10px 24px rgba(74, 93, 78, 0.2)',
};

const orderReceipt = {
  padding: '24px',
  backgroundColor: '#FFF',
  borderRadius: '16px',
  textAlign: 'left',
  marginBottom: '30px',
};

const receiptRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '14px',
  color: '#5E5A57',
  padding: '8px 0',
  borderBottom: '1px solid rgba(74, 93, 78, 0.05)',
};

const successBtns = {
  display: 'flex',
  gap: '16px',
  justifyContent: 'center',
};

const btnPrimary = {
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px 24px',
  borderRadius: '10px',
  fontWeight: '700',
};

const btnSecondary = {
  border: '1px solid #4A5D4E',
  color: '#4A5D4E',
  padding: '14px 24px',
  borderRadius: '10px',
  fontWeight: '700',
  backgroundColor: 'transparent',
};

const couponBoxStyle = {
  marginTop: '20px',
  paddingTop: '20px',
  borderTop: '1px dashed rgba(74, 93, 78, 0.15)',
};

const couponBoxTitle = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#1C1A19',
  marginBottom: '10px',
};

const couponInputRow = {
  display: 'flex',
  gap: '8px',
};

const couponInputStyle = {
  flex: 1,
  padding: '8px 12px',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  fontSize: '13px',
  backgroundColor: '#FFF',
  outline: 'none',
  textTransform: 'uppercase',
};

const couponApplyBtn = {
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
};

const couponAppliedRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#EAF6EC',
  padding: '8px 12px',
  borderRadius: '8px',
  border: '1px solid rgba(46, 125, 50, 0.15)',
};

const couponBadgeStyle = {
  color: '#2E7D32',
  fontWeight: '700',
  fontSize: '13px',
};

const couponRemoveBtn = {
  background: 'none',
  border: 'none',
  color: '#b23b3b',
  fontWeight: '700',
  fontSize: '12px',
  cursor: 'pointer',
  padding: 0,
};

const couponErrorStyle = {
  color: '#b23b3b',
  fontSize: '12px',
  marginTop: '6px',
  fontWeight: '600',
};

const couponSuggestionStyle = {
  fontSize: '12.5px',
  color: '#5E5A57',
  marginTop: '8px',
  lineHeight: '1.4',
};

const couponSuggestionBtn = {
  background: 'none',
  border: 'none',
  color: '#4A5D4E',
  fontWeight: '700',
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
};

export default Checkout;
