// src/contexts/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import ApiService from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart data from API
  const fetchCart = async () => {
    if (!user) {
      setCartCount(0);
      setCartItems([]);
      return;
    }

    setLoading(true);
    try {
      const cart = await ApiService.getCart();
      const items = cart.items || [];
      const count = items.reduce((total, item) => total + item.quantity, 0);
      
      setCartItems(items);
      setCartCount(count);
      
      console.log('🛒 Cart updated:', { count, items: items.length });
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartCount(0);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user) {
      throw new Error('Please login to add items to cart');
    }

    try {
      await ApiService.addToCart(productId, quantity);
      // Immediately update count optimistically
      setCartCount(prev => prev + quantity);
      // Then fetch actual data
      await fetchCart();
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      await ApiService.updateCartItem(itemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      await ApiService.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Refresh cart data
  const refreshCart = () => {
    fetchCart();
  };

  // Fetch cart when user changes
  useEffect(() => {
    fetchCart();
  }, [user]);

  const value = {
    cartCount,
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};