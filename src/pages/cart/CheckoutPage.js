// src/pages/cart/CheckoutPage.js - Futuristic SportWear Design
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CheckoutPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const fetchCart = useCallback(async () => {
    try {
      const cartData = await ApiService.getCart();
      setCart(cartData);
      if (!cartData || cartData.items.length === 0) {
        navigate('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCart();
    if (user) {
      setFormData({
        full_name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || ''
      });
    }
  }, [user, fetchCart]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await ApiService.createOrder(formData);
      showSuccess('🏆 Order placed successfully! Your champion gear is on the way!');
      navigate('/orders');
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Error placing order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.items.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-24">
      {/* Hero Header */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
        
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full filter blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">FINAL STEP</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
              SECURE YOUR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                VICTORY
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Complete your order and join the ranks of elite athletes who trust SportWear for championship performance.
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Shipping Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3">🚚</span>
                  Shipping Information
                </h2>
                <p className="text-gray-400">Where should we deliver your championship gear?</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold text-cyan-400 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    required
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Champion's full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-cyan-400 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="your.elite@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone_number" className="block text-sm font-semibold text-cyan-400 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    id="phone_number"
                    required
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Champion contact number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-semibold text-cyan-400 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    id="address"
                    rows={3}
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                    placeholder="Your champion headquarters address"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-cyan-400 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      id="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-cyan-400 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      id="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label htmlFor="zip_code" className="block text-sm font-semibold text-cyan-400 mb-2">
                      ZIP Code *
                    </label>
                    <input
                      type="text"
                      name="zip_code"
                      id="zip_code"
                      required
                      value={formData.zip_code}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      placeholder="ZIP"
                    />
                  </div>
                </div>

                {/* Payment Method Info */}
                <div className="bg-gradient-to-r from-orange-500/10 to-red-600/10 rounded-2xl p-6 border border-orange-500/20">
                  <div className="flex items-center mb-4">
                    <span className="text-orange-400 mr-3">💳</span>
                    <span className="text-orange-400 font-semibold">PAYMENT METHOD</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-semibold">Cash on Delivery (COD)</p>
                      <p className="text-gray-300 text-sm mt-1">
                        Pay securely when your championship gear arrives at your door.
                      </p>
                    </div>
                    <div className="text-4xl">📦</div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/25"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PLACING ORDER...
                    </div>
                  ) : (
                    '🏆 COMPLETE ORDER'
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 h-fit sticky top-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center">
                  <span className="mr-3">📋</span>
                  Order Summary
                </h2>
                <p className="text-gray-400">Your championship gear selection</p>
              </div>
              
              {/* Order Items */}
              <div className="space-y-4 mb-8">
                {cart.items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 animate-slide-in"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    {item.product.image ? (
                      <img 
                        src={item.product.image} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-700/50"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{item.product.name}</h4>
                      <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-xs font-semibold">
                          ELITE
                        </span>
                      </div>
                    </div>
                    <div className="text-cyan-400 font-bold text-lg">${item.subtotal}</div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                  <span className="text-gray-300 font-medium">Subtotal</span>
                  <span className="text-white font-semibold">${cart.total}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                  <span className="text-gray-300 font-medium">Shipping</span>
                  <span className="text-green-400 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-800/50">
                  <span className="text-gray-300 font-medium">Tax</span>
                  <span className="text-white font-semibold">Included</span>
                </div>
                <div className="flex justify-between items-center py-4">
                  <span className="text-xl font-bold text-white">Total</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    ${cart.total}
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>30-day performance guarantee</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Secure payment processing</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Championship-level customer support</span>
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <span className="text-green-400 mr-3">✓</span>
                  <span>Free shipping on all orders</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutPage;