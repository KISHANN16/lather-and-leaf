import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, itemsTotal, deliveryCharge, totalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div style={headerStyle}>
          <div style={titleArea}>
            <ShoppingBag size={22} style={{ color: '#4A5D4E' }} />
            <h2 style={titleStyle}>Your Shopping Bag</h2>
            <span style={countBadge}>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <button style={closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body - Item List */}
        <div style={bodyStyle}>
          {cartItems.length === 0 ? (
            <div style={emptyStyle}>
              <ShoppingBag size={48} style={{ color: '#EAD8C9', marginBottom: '16px' }} />
              <h3>Your bag is empty</h3>
              <p>Add some organic goodness to get started!</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product} style={itemCardStyle}>
                <div style={imgContainer}>
                  <img src={item.image} alt={item.name} style={itemImg} />
                </div>
                <div style={detailsStyle}>
                  <h4 style={itemName}>{item.name}</h4>
                  <div style={priceStyle}>₹{item.price} each</div>
                  <div style={actionsRow}>
                    <div style={qtyControls}>
                      <button style={qtyBtn} onClick={() => updateQuantity(item.product, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span style={qtyText}>{item.quantity}</span>
                      <button style={qtyBtn} onClick={() => updateQuantity(item.product, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button style={deleteBtn} onClick={() => removeFromCart(item.product)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div style={itemTotalStyle}>
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer - Totals & Actions */}
        {cartItems.length > 0 && (
          <div style={footerStyle}>
            <div style={summaryRow}>
              <span>Subtotal</span>
              <span>₹{itemsTotal}</span>
            </div>
            <div style={summaryRow}>
              <span>Shipping</span>
              <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>
            {deliveryCharge > 0 && (
              <div style={freeShippingTip}>
                Add <strong>₹{800 - itemsTotal}</strong> more for free shipping!
              </div>
            )}
            <div style={{ ...summaryRow, borderTop: '1px solid rgba(74, 93, 78, 0.08)', paddingTop: '14px', fontWeight: '800', fontSize: '18px' }}>
              <span>Total Price</span>
              <span style={{ color: '#4A5D4E' }}>₹{totalPrice}</span>
            </div>

            <Link to="/checkout" onClick={onClose} style={checkoutBtnStyle}>
              Proceed to Checkout
              <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Inline Styles for Premium Layout
const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(28, 26, 25, 0.4)',
  backdropFilter: 'blur(4px)',
  zIndex: 9990,
  display: 'flex',
  justifyContent: 'flex-end',
};

const drawerStyle = {
  width: '100%',
  maxWidth: '460px',
  height: '100%',
  backgroundColor: '#FFFDF9',
  boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.08)',
  display: 'flex',
  flexDirection: 'column',
  animation: 'slideInRight 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards',
};

const headerStyle = {
  padding: '24px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const titleArea = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const titleStyle = {
  fontSize: '20px',
  fontFamily: "'Playfair Display', serif",
  fontWeight: '700',
  color: '#1C1A19',
};

const countBadge = {
  background: '#EAD8C9',
  color: '#4A5D4E',
  fontSize: '12px',
  fontWeight: '800',
  borderRadius: '9999px',
  padding: '2px 8px',
};

const closeBtn = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: '4px',
  color: '#5E5A57',
  borderRadius: '50%',
  transition: 'background 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  ':hover': {
    background: 'rgba(74, 93, 78, 0.08)',
  }
};

const bodyStyle = {
  flex: 1,
  padding: '24px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const emptyStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  color: '#5E5A57',
  textAlign: 'center',
};

const itemCardStyle = {
  display: 'flex',
  gap: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid rgba(74, 93, 78, 0.05)',
  alignItems: 'center',
};

const imgContainer = {
  width: '74px',
  height: '74px',
  borderRadius: '12px',
  overflow: 'hidden',
  backgroundColor: '#FFF',
  border: '1px solid rgba(74, 93, 78, 0.06)',
};

const itemImg = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const detailsStyle = {
  flex: 1,
};

const itemName = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#1C1A19',
  marginBottom: '4px',
  fontFamily: "'Inter', sans-serif",
};

const priceStyle = {
  fontSize: '13px',
  color: '#5E5A57',
  marginBottom: '10px',
};

const actionsRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const qtyControls = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(74, 93, 78, 0.15)',
  borderRadius: '8px',
  overflow: 'hidden',
};

const qtyBtn = {
  border: 'none',
  background: 'none',
  padding: '6px 8px',
  cursor: 'pointer',
  color: '#4A5D4E',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const qtyText = {
  padding: '0 8px',
  fontSize: '14px',
  fontWeight: '700',
  color: '#1C1A19',
};

const deleteBtn = {
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: '#A09690',
  padding: '4px',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.2s',
  ':hover': {
    color: '#b23b3b',
  }
};

const itemTotalStyle = {
  fontWeight: '700',
  color: '#1C1A19',
  fontSize: '15px',
};

const footerStyle = {
  padding: '24px',
  borderTop: '1px solid rgba(74, 93, 78, 0.08)',
  backgroundColor: '#FFFDF9',
};

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '15px',
  color: '#5E5A57',
  marginBottom: '10px',
};

const freeShippingTip = {
  fontSize: '12px',
  color: '#4A5D4E',
  backgroundColor: '#F0F5F1',
  padding: '8px 12px',
  borderRadius: '8px',
  textAlign: 'center',
  marginBottom: '16px',
  fontWeight: '500',
};

const checkoutBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  width: '100%',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '16px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '15px',
  border: 'none',
  cursor: 'pointer',
  marginTop: '16px',
  boxShadow: '0 8px 20px rgba(74, 93, 78, 0.15)',
  transition: 'background-color 0.2s',
};

export default CartDrawer;
