import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Package, User, MapPin, Calendar, CheckCircle } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/api/orders/myorders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          logout();
          navigate('/login');
          throw new Error('Session expired');
        }
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [token, navigate]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return { bg: '#EAF6EC', color: '#2E7D32' };
      case 'Shipped': return { bg: '#FFF5E8', color: '#8B5E34' };
      case 'Cancelled': return { bg: '#FFF0F0', color: '#B23B3B' };
      default: return { bg: '#EEF0F2', color: '#5E5A57' }; // Processing
    }
  };

  return (
    <div style={containerStyle} className="container animate-fade-in">
      <ScrollReveal direction="down">
        <div style={headerStyle}>
          <h1 style={titleStyle}>My Account Dashboard</h1>
          <p style={subStyle}>Manage your shipping info and check the live status of your soap deliveries.</p>
        </div>
      </ScrollReveal>

      <div style={dashboardGrid} className="dashboard-grid">
        {/* Profile Card Left */}
        <div style={leftColStyle}>
          <ScrollReveal direction="left" duration={0.8}>
            <div style={profileCard} className="glass-panel">
              <div style={avatarWrap}>
                <User size={34} style={{ color: '#4A5D4E' }} />
              </div>
              <h3 style={profileName}>{user?.name}</h3>
              <p style={profileEmail}>{user?.email}</p>
              <span className="chip" style={{ width: 'fit-content', marginTop: '10px' }}>
                Member Since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" duration={0.8} delay={0.15}>
            <div style={addressCard} className="glass-panel">
              <div style={cardHeader}>
                <MapPin size={18} style={{ color: '#A06E52' }} />
                <h4>Default Shipping Address</h4>
              </div>
              {user?.address ? (
                <div style={addressDetails}>
                  <p><strong>{user.address.fullName}</strong></p>
                  <p>{user.address.address1}</p>
                  {user.address.address2 && <p>{user.address.address2}</p>}
                  <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                  <p>Phone: {user.address.phone}</p>
                </div>
              ) : (
                <div style={noAddressStyle}>
                  <p>No default address registered yet.</p>
                  <Link to="/checkout" style={addAddressLink}>Fill Shipping Address</Link>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>

        {/* Order History Card Right */}
        <ScrollReveal direction="right" duration={0.8} style={{ width: '100%' }}>
          <div style={rightColStyle} className="glass-panel">
            <div style={cardHeader}>
              <Package size={22} style={{ color: '#4A5D4E' }} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px' }}>Order History</h3>
            </div>

            {loading ? (
              <div style={loaderStyle}>Loading order list...</div>
            ) : orders.length === 0 ? (
              <div style={emptyOrders}>
                <Package size={48} style={{ color: '#EAD8C9', marginBottom: '16px' }} />
                <h3>No Orders Placed Yet</h3>
                <p>When you purchase natural soaps, your orders will display here.</p>
                <Link to="/shop" style={btnPrimary}>Go to Shop</Link>
              </div>
            ) : (
              <div style={ordersList}>
                {orders.map((order) => {
                  const colors = getStatusColor(order.orderStatus);
                  return (
                    <div key={order._id} style={orderItemCard}>
                      <div style={orderHeader}>
                        <div>
                          <span style={orderLabel}>Tracking ID</span>
                          <strong style={orderIdText}>{order.orderId}</strong>
                        </div>
                        <span style={{
                          backgroundColor: colors.bg,
                          color: colors.color,
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                        }}>
                          {order.orderStatus}
                        </span>
                      </div>

                      <div style={orderContent}>
                        <div style={orderCol}>
                          <span style={orderLabel}><Calendar size={13} style={{ marginRight: '4px' }} /> Date Placed</span>
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div style={orderCol}>
                          <span style={orderLabel}>Items Purchased</span>
                          <span style={itemsText}>
                            {order.orderItems.map((item) => `${item.quantity} × ${item.name}`).join(', ')}
                          </span>
                        </div>
                        <div style={orderCol}>
                          <span style={orderLabel}>Total Price</span>
                          <strong style={priceText}>₹{order.totalPrice}</strong>
                        </div>
                      </div>

                      {/* Visual Order Progress Stepper */}
                      {order.orderStatus === 'Cancelled' ? (
                        <div style={cancelledBannerStyle}>
                          <span>❌ This order was cancelled. Feel free to contact our customer support.</span>
                        </div>
                      ) : (
                        <div style={stepperContainer}>
                          <div style={stepStyle(true)}>
                            <div style={stepCircleStyle(true)}>✓</div>
                            <span style={stepLabelStyle(true)}>Placed</span>
                          </div>
                          
                          <div style={stepLineStyle(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered')}></div>
                          
                          <div style={stepStyle(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered')}>
                            <div style={stepCircleStyle(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered')}>
                              {order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '✓' : '2'}
                            </div>
                            <span style={stepLabelStyle(order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered')}>Shipped</span>
                          </div>
                          
                          <div style={stepLineStyle(order.orderStatus === 'Delivered')}></div>
                          
                          <div style={stepStyle(order.orderStatus === 'Delivered')}>
                            <div style={stepCircleStyle(order.orderStatus === 'Delivered')}>
                              {order.orderStatus === 'Delivered' ? '✓' : '3'}
                            </div>
                            <span style={stepLabelStyle(order.orderStatus === 'Delivered')}>Delivered</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

// CSS in JS Styling
const containerStyle = {
  paddingTop: '40px',
  fontFamily: "'Inter', sans-serif",
};

const headerStyle = {
  marginBottom: '40px',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '44px',
  fontFamily: "'Playfair Display', serif",
  color: '#1C1A19',
  marginBottom: '10px',
};

const subStyle = {
  fontSize: '16px',
  color: '#5E5A57',
  maxWidth: '650px',
  margin: '0 auto',
};

const dashboardGrid = {
  display: 'grid',
  gridTemplateColumns: '340px 1fr',
  gap: '30px',
};

const leftColStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
};

const profileCard = {
  padding: '30px 24px',
  textAlign: 'center',
  backgroundColor: '#FFFDF9',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const avatarWrap = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: '#EEF0F2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
  border: '2px solid rgba(74, 93, 78, 0.15)',
};

const profileName = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '700',
  color: '#1C1A19',
};

const profileEmail = {
  fontSize: '14px',
  color: '#5E5A57',
};

const addressCard = {
  padding: '24px',
  backgroundColor: '#FFFDF9',
};

const cardHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '18px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
};

const addressDetails = {
  fontSize: '14px',
  color: '#5E5A57',
  lineHeight: '1.6',
};

const noAddressStyle = {
  textAlign: 'center',
  color: '#A09690',
  padding: '16px 0',
  fontSize: '14px',
};

const addAddressLink = {
  display: 'inline-block',
  marginTop: '10px',
  color: '#4A5D4E',
  fontWeight: '700',
};

const rightColStyle = {
  padding: '34px',
  backgroundColor: '#FFFDF9',
  alignSelf: 'start',
};

const loaderStyle = {
  textAlign: 'center',
  padding: '60px 0',
  color: '#5E5A57',
};

const emptyOrders = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#5E5A57',
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

const ordersList = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginTop: '10px',
};

const orderItemCard = {
  border: '1px solid rgba(74, 93, 78, 0.08)',
  borderRadius: '16px',
  padding: '20px',
  backgroundColor: '#FFF',
};

const orderHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(74, 93, 78, 0.05)',
  paddingBottom: '12px',
  marginBottom: '14px',
};

const orderLabel = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '800',
  textTransform: 'uppercase',
  color: '#A06E52',
  letterSpacing: '0.5px',
  marginBottom: '2px',
};

const orderIdText = {
  fontSize: '15px',
  color: '#1C1A19',
};

const orderContent = {
  display: 'grid',
  gridTemplateColumns: '1.2fr 2fr 1fr',
  gap: '20px',
};

const orderCol = {
  display: 'flex',
  flexDirection: 'column',
  fontSize: '14px',
  color: '#5E5A57',
};

const itemsText = {
  fontWeight: '600',
  color: '#1C1A19',
};

const priceText = {
  fontSize: '16px',
  color: '#4A5D4E',
};

// Visual Stepper Styles
const stepperContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '24px',
  paddingTop: '20px',
  borderTop: '1px dashed rgba(74, 93, 78, 0.12)',
  gap: '8px',
};

const stepStyle = (isActive) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: '1',
  position: 'relative',
});

const stepCircleStyle = (isActive) => ({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  backgroundColor: isActive ? '#4A5D4E' : '#EEF0F2',
  color: isActive ? '#FFFDF9' : '#A09690',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
  fontWeight: '800',
  boxShadow: isActive ? '0 4px 10px rgba(74, 93, 78, 0.2)' : 'none',
  transition: 'all 0.3s ease',
});

const stepLabelStyle = (isActive) => ({
  fontSize: '11.5px',
  fontWeight: isActive ? '800' : '650',
  color: isActive ? '#4A5D4E' : '#A09690',
  marginTop: '6px',
  textAlign: 'center',
});

const stepLineStyle = (isActive) => ({
  height: '3px',
  flex: '2',
  backgroundColor: isActive ? '#4A5D4E' : '#EEF0F2',
  borderRadius: '2px',
  margin: '0 -15px 16px -15px',
  transition: 'all 0.3s ease',
});

const cancelledBannerStyle = {
  marginTop: '20px',
  padding: '12px 18px',
  borderRadius: '10px',
  backgroundColor: '#FFF0F0',
  color: '#B23B3B',
  fontWeight: '700',
  fontSize: '13px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  border: '1px solid rgba(178, 59, 59, 0.12)',
};

export default Dashboard;
