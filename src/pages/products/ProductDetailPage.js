// src/pages/products/ProductDetailPage.js - Futuristic Design
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const fetchProduct = useCallback(async () => {
    try {
      const productData = await ApiService.getProduct(id);
      setProduct(productData);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      await ApiService.addToCart(product.id, quantity);
      showSuccess(`${product.name} added to cart! 🛒`);
      
      // Update cart count in header
      if (window.updateHeaderCartCount) {
        window.updateHeaderCartCount();
      }
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white mb-6">
                PRODUCT
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  NOT FOUND
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                This championship gear couldn't be located. It might have been moved to a different battlefield.
              </p>
              <Link 
                to="/products" 
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                🔍 EXPLORE ALL PRODUCTS
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
        
        {/* Dynamic Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-600 rounded-full filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                  Products
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <span className="text-cyan-400 font-semibold">{product.name}</span>
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50 shadow-2xl">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <svg className="w-24 h-24 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: "🏆", label: "Elite Grade" },
                  { icon: "⚡", label: "High Performance" },
                  { icon: "🛡️", label: "Tested & Proven" }
                ].map((feature, index) => (
                  <div key={index} className="text-center p-4 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <div className="text-gray-300 text-sm font-semibold">{feature.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6">
                  <span className="text-cyan-400 font-semibold tracking-wider text-sm">
                    {product.category_name || 'ELITE GEAR'}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    ${product.price}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                    IN STOCK
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">📋</span>
                  Championship Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Product Type */}
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  Product Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 block">Category:</span>
                    <span className="text-cyan-400 font-semibold">{product.category_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Type:</span>
                    <span className="text-cyan-400 font-semibold">{product.product_type}</span>
                  </div>
                </div>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="bg-gray-900/30 rounded-2xl p-6 border border-gray-800/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">🛒</span>
                  Add to Arsenal
                </h3>
                
                <div className="space-y-6">
                  {/* Quantity Selector */}
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-semibold text-cyan-400 mb-2">
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-32 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      disabled={addingToCart || !user}
                      className={`flex-1 px-8 py-4 font-bold text-lg rounded-xl transition-all duration-300 shadow-lg ${
                        user 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 hover:shadow-cyan-500/25' 
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      } ${addingToCart ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {addingToCart ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>ADDING TO CART...</span>
                        </div>
                      ) : user ? (
                        <div className="flex items-center justify-center">
                          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h6" />
                          </svg>
                          <span>🚀 ADD TO CART</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span>LOGIN TO PURCHASE</span>
                        </div>
                      )}
                    </button>
                    
                    {!user && (
                      <Link 
                        to="/login" 
                        className="flex-1 px-8 py-4 border-2 border-gray-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 font-bold text-lg rounded-xl transition-all duration-300 text-center flex items-center justify-center"
                      >
                        🔑 LOGIN
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Guarantees */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-2xl p-6 border border-green-500/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">🛡️</span>
                  Championship Guarantees
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center text-green-400">
                    <span className="mr-3">✓</span>
                    <span className="font-semibold">30-day performance guarantee</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-3">✓</span>
                    <span className="font-semibold">Free shipping on all orders</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-3">✓</span>
                    <span className="font-semibold">Secure payment processing</span>
                  </div>
                  <div className="flex items-center text-green-400">
                    <span className="mr-3">✓</span>
                    <span className="font-semibold">Championship-level customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Performance Features Section */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              WHY THIS
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> ELITE GEAR</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              This product represents the pinnacle of athletic performance technology, designed for champions who demand excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Precision Engineering",
                description: "Every component designed with millimeter precision for optimal athletic performance and durability."
              },
              {
                icon: "⚡",
                title: "Lightning Performance",
                description: "Advanced materials and design optimized for speed, agility, and endurance in competitive environments."
              },
              {
                icon: "🔥",
                title: "Champion Tested",
                description: "Proven in competition by professional athletes who demand nothing but the absolute best gear."
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 bg-gray-900/30 rounded-2xl border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50">
            <h3 className="text-3xl font-bold text-white mb-8 text-center">
              TECHNICAL
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> SPECIFICATIONS</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Info */}
              <div className="space-y-6">
                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Product Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Product ID:</span>
                      <span className="text-cyan-400 font-semibold">#{product.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white font-semibold">{product.category_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white font-semibold">{product.product_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400 font-semibold">In Stock</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Durability Rating:</span>
                      <span className="text-yellow-400 font-semibold">⭐⭐⭐⭐⭐</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Performance Level:</span>
                      <span className="text-cyan-400 font-semibold">Elite</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quality Grade:</span>
                      <span className="text-purple-400 font-semibold">Championship</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping & Returns */}
              <div className="space-y-6">
                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Shipping Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">🚚</span>
                      <span>Free shipping worldwide</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <span className="mr-2">⚡</span>
                      <span>Express delivery available</span>
                    </div>
                    <div className="flex items-center text-purple-400">
                      <span className="mr-2">📦</span>
                      <span>Premium packaging included</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Return Policy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">🔄</span>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center text-blue-400">
                      <span className="mr-2">💯</span>
                      <span>100% satisfaction guarantee</span>
                    </div>
                    <div className="flex items-center text-purple-400">
                      <span className="mr-2">🆓</span>
                      <span>Free return shipping</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              COMPLETE YOUR
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> ARSENAL</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Champions never settle. Explore more elite gear to dominate every aspect of your performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Similar Products",
                description: "Discover more championship gear in the same category.",
                link: `/category/${product.category}`,
                icon: "🎯",
                color: "cyan"
              },
              {
                title: "Complete Collection",
                description: "Explore our full range of elite athletic equipment.",
                link: "/products",
                icon: "🏆",
                color: "purple"
              },
              {
                title: "New Arrivals",
                description: "Check out the latest additions to our elite catalog.",
                link: "/products?filter=newest",
                icon: "⚡",
                color: "orange"
              }
            ].map((item, index) => (
              <Link 
                key={index}
                to={item.link}
                className="group text-center p-8 bg-gray-900/30 rounded-2xl border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-gray-400 mb-6">{item.description}</p>
                <span className={`inline-block px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  item.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/30' :
                  item.color === 'purple' ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30' :
                  'bg-orange-500/20 text-orange-400 group-hover:bg-orange-500/30'
                }`}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailPage;