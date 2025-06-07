// src/components/common/Header.js - Futuristic SportWear Design
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ApiService from '../../services/api';

const Header = () => {
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to update cart count
  const updateCartCount = async () => {
    if (user) {
      try {
        const cart = await ApiService.getCart();
        const totalItems = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(totalItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    
    window.updateHeaderCartCount = updateCartCount;
    
    const handleCartUpdate = () => {
      updateCartCount();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      delete window.updateHeaderCartCount;
    };
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsAdminMenuOpen(false);
  };

  const isAdmin = user && user.role === 'ADMIN';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl shadow-cyan-500/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Revolutionary Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/25">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-cyan-300 group-hover:to-purple-400 transition-all duration-300">
                SportWear
              </span>
              <div className="text-xs text-gray-400 tracking-wider font-semibold">PERFORMANCE</div>
            </div>
          </Link>

          {/* Futuristic Navigation */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-900/30 backdrop-blur-sm rounded-full px-6 py-2 border border-gray-800/50">
            <Link 
              to="/" 
              className="px-6 py-2 text-gray-300 hover:text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-500/10 rounded-full relative group"
            >
              Home
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/products" 
              className="px-6 py-2 text-gray-300 hover:text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-500/10 rounded-full relative group"
            >
              Products
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-full transition-all duration-300"></div>
            </Link>
            <Link 
              to="/categories" 
              className="px-6 py-2 text-gray-300 hover:text-cyan-400 font-semibold transition-all duration-300 hover:bg-cyan-500/10 rounded-full relative group"
            >
              Categories
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/10 group-hover:to-blue-500/10 rounded-full transition-all duration-300"></div>
            </Link>
            
            {/* Admin Dropdown */}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="px-6 py-2 text-orange-400 hover:text-orange-300 font-semibold transition-all duration-300 hover:bg-orange-500/10 rounded-full flex items-center relative group"
                >
                  Admin
                  <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-red-500/0 group-hover:from-orange-500/10 group-hover:to-red-500/10 rounded-full transition-all duration-300"></div>
                </button>
                
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-gray-800/50 animate-slide-in">
                    <Link
                      to="/admin/users"
                      className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">👥</span>
                        Manage Users
                      </span>
                    </Link>
                    <Link
                      to="/admin/categories"
                      className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">🏷️</span>
                        Manage Categories
                      </span>
                    </Link>
                    <Link
                      to="/admin/products"
                      className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">📦</span>
                        Manage Products
                      </span>
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      <span className="flex items-center">
                        <span className="mr-3">📋</span>
                        Manage Orders
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Futuristic Cart */}
                <Link to="/cart" className="relative group">
                  <div className="w-12 h-12 bg-gray-900/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:bg-cyan-500/10">
                    <svg className="w-6 h-6 text-gray-300 group-hover:text-cyan-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6" />
                    </svg>
                  </div>
                  {cartCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 animate-pulse">
                      {cartCount}
                    </div>
                  )}
                </Link>

                {/* User Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-3 group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white font-bold text-sm">
                        {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors duration-300">
                        {user.first_name || user.email}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {user.role === 'ADMIN' ? 'Administrator' : 'Athlete'}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-all duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl py-2 z-50 border border-gray-800/50 animate-slide-in">
                      <Link
                        to="/profile"
                        className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center">
                          <span className="mr-3">👤</span>
                          Profile Settings
                        </span>
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-6 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="flex items-center">
                          <span className="mr-3">📦</span>
                          My Orders
                        </span>
                      </Link>
                      <div className="border-t border-gray-800/50 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 font-medium"
                      >
                        <span className="flex items-center">
                          <span className="mr-3">🚪</span>
                          Sign Out
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-cyan-400 font-semibold transition-colors duration-300 px-4 py-2 hover:bg-cyan-500/10 rounded-full"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 bg-gray-900/50 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
            >
              <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-6 animate-slide-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-300 hover:text-cyan-400 font-semibold px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-gray-300 hover:text-cyan-400 font-semibold px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                to="/categories" 
                className="text-gray-300 hover:text-cyan-400 font-semibold px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              
              {isAdmin && (
                <>
                  <div className="border-t border-gray-800/50 pt-4 mt-4">
                    <p className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-3 px-4">Admin Panel</p>
                    <Link 
                      to="/admin/users" 
                      className="block text-gray-300 hover:text-cyan-400 px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      👥 Manage Users
                    </Link>
                    <Link 
                      to="/admin/categories" 
                      className="block text-gray-300 hover:text-cyan-400 px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🏷️ Manage Categories
                    </Link>
                    <Link 
                      to="/admin/products" 
                      className="block text-gray-300 hover:text-cyan-400 px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📦 Manage Products
                    </Link>
                    <Link 
                      to="/admin/orders" 
                      className="block text-gray-300 hover:text-cyan-400 px-4 py-2 hover:bg-cyan-500/10 rounded-lg transition-all duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📋 Manage Orders
                    </Link>
                  </div>
                </>
              )}
              
              {!user && (
                <div className="border-t border-gray-800/50 pt-4 flex flex-col space-y-3">
                  <Link 
                    to="/login" 
                    className="text-center py-3 border border-cyan-500/30 text-cyan-400 font-semibold rounded-xl hover:bg-cyan-500/10 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-center py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;