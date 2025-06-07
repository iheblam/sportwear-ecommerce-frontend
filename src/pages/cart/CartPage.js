// src/pages/cart/CartPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const cartData = await ApiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      if (newQuantity === 0) {
        await ApiService.removeFromCart(itemId);
      } else {
        await ApiService.updateCartItem(itemId, newQuantity);
      }
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(prev => ({ ...prev, [itemId]: true }));
    try {
      await ApiService.removeFromCart(itemId);
      await fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white mb-6">
                YOUR CART IS
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  EMPTY
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Time to gear up! Add some championship-level equipment to fuel your performance.
              </p>
              <Link 
                to="/products" 
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                🚀 START SHOPPING
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-16 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-8">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">PERFORMANCE CART</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              YOUR GEAR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                SELECTION
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Review your championship equipment. Every item selected for peak performance and victory.
            </p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 animate-slide-in"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <div className="flex items-center space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      {item.product.image ? (
                        <img 
                          src={item.product.image} 
                          alt={item.product.name}
                          className="w-24 h-24 object-cover rounded-xl border-2 border-gray-700/50"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border-2 border-gray-700/50">
                          <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{item.product.name}</h3>
                      <p className="text-cyan-400 font-semibold text-lg">${item.product.price}</p>
                      <div className="mt-2">
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
                          ELITE GEAR
                        </span>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 bg-gray-800/50 rounded-xl p-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating[item.id] || item.quantity <= 1}
                          className="w-10 h-10 rounded-lg bg-gray-700/50 hover:bg-red-500/20 hover:text-red-400 text-gray-300 flex items-center justify-center disabled:opacity-50 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="w-12 text-center text-white font-bold text-lg">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating[item.id]}
                          className="w-10 h-10 rounded-lg bg-gray-700/50 hover:bg-green-500/20 hover:text-green-400 text-gray-300 flex items-center justify-center disabled:opacity-50 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    {/* Price and Remove */}
                    <div className="text-right">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-3">
                        ${item.subtotal}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating[item.id]}
                        className="w-10 h-10 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 flex items-center justify-center disabled:opacity-50 transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 sticky top-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Order Summary</h2>
                  <p className="text-gray-400">Your path to championship performance</p>
                </div>
                
                {/* Summary Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                    <span className="text-gray-300 font-medium">Items ({cart.items.length})</span>
                    <span className="text-white font-semibold">${cart.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                    <span className="text-gray-300 font-medium">Shipping</span>
                    <span className="text-green-400 font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                    <span className="text-gray-300 font-medium">Tax</span>
                    <span className="text-white font-semibold">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between items-center py-4">
                    <span className="text-xl font-bold text-white">Total</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                      ${cart.total}
                    </span>
                  </div>
                </div>

                {/* Performance Guarantee */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl p-4 mb-8 border border-cyan-500/20">
                  <div className="flex items-center mb-2">
                    <span className="text-cyan-400 mr-2">🏆</span>
                    <span className="text-cyan-400 font-semibold">CHAMPION GUARANTEE</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Premium gear backed by our performance promise. Dominate with confidence.
                  </p>
                </div>
                
                {/* Checkout Button */}
                <Link 
                  to="/checkout" 
                  className="w-full block text-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 mb-6"
                >
                  🚀 PROCEED TO CHECKOUT
                </Link>

                {/* Continue Shopping */}
                <Link 
                  to="/products" 
                  className="w-full block text-center px-8 py-3 border-2 border-gray-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 font-semibold rounded-xl transition-all duration-300"
                >
                  ← Continue Shopping
                </Link>

                {/* Security Features */}
                <div className="mt-8 pt-6 border-t border-gray-800/50">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-green-400 mb-2">🔒</div>
                      <div className="text-xs text-gray-400 font-medium">SECURE</div>
                    </div>
                    <div>
                      <div className="text-blue-400 mb-2">⚡</div>
                      <div className="text-xs text-gray-400 font-medium">FAST</div>
                    </div>
                    <div>
                      <div className="text-purple-400 mb-2">✨</div>
                      <div className="text-xs text-gray-400 font-medium">PREMIUM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Products */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              COMPLETE YOUR
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> ARSENAL</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Champions never settle. Add these performance-enhancing items to dominate your competition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Performance Enhancement",
                description: "Boost your training with advanced gear designed for champions.",
                icon: "⚡",
                color: "cyan"
              },
              {
                title: "Recovery Solutions",
                description: "Professional recovery equipment for faster performance gains.",
                icon: "🔋",
                color: "purple"
              },
              {
                title: "Elite Accessories",
                description: "Complete your setup with championship-level accessories.",
                icon: "🎯",
                color: "orange"
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gray-900/30 rounded-2xl border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <Link 
                  to="/products" 
                  className={`inline-block px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                    feature.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30' :
                    feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30' :
                    'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
                  }`}
                >
                  Explore
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CartPage;