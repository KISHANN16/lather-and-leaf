import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();
  const [appliedCoupon, setAppliedCoupon] = useState('');

  // Load/merge cart when user changes
  useEffect(() => {
    if (user) {
      // User logged in
      const userKey = `ll_cart_${user._id}`;
      const userCartRaw = localStorage.getItem(userKey);
      const userCart = userCartRaw ? JSON.parse(userCartRaw) : [];

      const guestCartRaw = localStorage.getItem('ll_cart_guest');
      const guestCart = guestCartRaw ? JSON.parse(guestCartRaw) : [];

      if (guestCart.length > 0) {
        // Merge guest cart into user cart
        const mergedCart = [...userCart];
        guestCart.forEach(guestItem => {
          const existingIndex = mergedCart.findIndex(item => item.product === guestItem.product);
          if (existingIndex > -1) {
            mergedCart[existingIndex].quantity += guestItem.quantity;
          } else {
            mergedCart.push(guestItem);
          }
        });

        // Save merged cart
        localStorage.setItem(userKey, JSON.stringify(mergedCart));
        setCartItems(mergedCart);

        // Clear guest cart
        localStorage.removeItem('ll_cart_guest');
      } else {
        setCartItems(userCart);
      }
    } else {
      // Guest or logged out
      const guestCartRaw = localStorage.getItem('ll_cart_guest');
      setCartItems(guestCartRaw ? JSON.parse(guestCartRaw) : []);
    }
  }, [user]);

  // Save cart when modified
  const saveCart = (items) => {
    setCartItems(items);
    const key = user ? `ll_cart_${user._id}` : 'll_cart_guest';
    localStorage.setItem(key, JSON.stringify(items));
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const addToCart = (product, quantity = 1) => {
    const existingIndex = cartItems.findIndex(item => item.product === product._id);
    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '/assets/neem-soap.png',
        quantity: quantity,
      });
    }

    saveCart(updatedCart);
    showToast(`Added ${quantity} × ${product.name} to cart`);
  };

  const removeFromCart = (productId) => {
    const item = cartItems.find(item => item.product === productId);
    const updatedCart = cartItems.filter(item => item.product !== productId);
    saveCart(updatedCart);
    if (item) {
      showToast(`Removed ${item.name} from cart`);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.product === productId ? { ...item, quantity: newQuantity } : item
    );
    saveCart(updatedCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  const getDiscountAmount = () => {
    if (appliedCoupon === 'ORGANIC10') {
      return Math.round(itemsTotal * 0.1);
    }
    if (appliedCoupon === 'LATHER20') {
      return Math.round(itemsTotal * 0.2);
    }
    return 0;
  };

  const discountAmount = getDiscountAmount();

  // Delivery Charge: Free if subtotal >= ₹800, or coupon is active and subtotal >= ₹500, else ₹70
  const isEligibleForFreeShipping = itemsTotal >= 800 || (appliedCoupon === 'FREESHIP500' && itemsTotal >= 500);
  const deliveryCharge = isEligibleForFreeShipping || itemsTotal === 0 ? 0 : 70;
  const totalPrice = Math.max(0, itemsTotal - discountAmount + deliveryCharge);

  const applyCoupon = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'FREE500' || cleanCode === 'FREESHIP500') {
      if (itemsTotal < 500) {
        return { success: false, message: 'Subtotal must be ₹500 or more to apply this coupon.' };
      }
      setAppliedCoupon(cleanCode);
      showToast(`Coupon ${cleanCode} applied! Free shipping active.`);
      return { success: true, message: 'Coupon applied successfully!' };
    } else if (cleanCode === 'ORGANIC10') {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon ${cleanCode} applied! 10% discount active.`);
      return { success: true, message: 'Coupon applied successfully!' };
    } else if (cleanCode === 'LATHER20') {
      setAppliedCoupon(cleanCode);
      showToast(`Coupon ${cleanCode} applied! 20% discount active.`);
      return { success: true, message: 'Coupon applied successfully!' };
    } else {
      return { success: false, message: 'Invalid coupon code.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    showToast('Coupon removed.');
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemsTotal,
      deliveryCharge,
      totalPrice,
      toast,
      showToast,
      appliedCoupon,
      applyCoupon,
      removeCoupon,
      discountAmount
    }}>
      {children}
      {toast && (
        <div style={toastStyle} className="animate-toast">
          {toast}
        </div>
      )}
    </CartContext.Provider>
  );
};

const toastStyle = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  backgroundColor: '#4A5D4E',
  color: '#FFFDF9',
  padding: '14px 24px',
  borderRadius: '12px',
  boxShadow: '0 10px 24px rgba(74, 93, 78, 0.15)',
  zIndex: 9999,
  fontFamily: "'Inter', sans-serif",
  fontWeight: '600',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  animation: 'toastIn 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards'
};

export const useCart = () => useContext(CartContext);
export default CartContext;
