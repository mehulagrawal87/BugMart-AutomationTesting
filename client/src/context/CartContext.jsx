import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('qa_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    localStorage.setItem('qa_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, quantity = 1) => {
    const qty = parseInt(quantity, 10);
    setItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prevItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: qty
      }];
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: isNaN(qty) ? 1 : qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponError('');
    localStorage.removeItem('qa_cart');
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const res = await fetch('/api/cart/apply-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCouponError(data.message || 'Invalid coupon code.');
        return { success: false, message: data.message };
      }

      setAppliedCoupon({
        code: data.code,
        discount: data.discount,
        freeShipping: data.freeShipping
      });

      return { success: true, message: data.message };
    } catch (err) {
      setCouponError('Error connecting to coupon verification server.');
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let shipping = 0;
  if (items.length > 0) {
    if (appliedCoupon?.freeShipping) {
      shipping = 0;
    } else if (subtotal >= 50) {
      shipping = 0;
    } else {
      shipping = 4.99;
    }
  }

  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const tax = items.length > 0 ? parseFloat((subtotal * 0.08).toFixed(2)) : 0;
  const total = Math.max(0, parseFloat((subtotal - discount + shipping + tax).toFixed(2)));
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      appliedCoupon,
      couponError,
      subtotal: parseFloat(subtotal.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      tax,
      total,
      totalItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
