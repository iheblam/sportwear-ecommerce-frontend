// src/pages/products/ProductsPage.js - Revolutionary Sports Design
import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchAllProducts();
    }
  }, [selectedCategory]);

  const fetchInitialData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        ApiService.getCategories(),
        ApiService.getProducts(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProducts = async () => {
    try {
      const productsData = await ApiService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const productsData = await ApiService.getProductsByCategory(categoryId);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products by category:', error);
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category_name && product.category_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black/50"></div>
        
        {/* Dynamic Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-gradient-to-br from-orange-400 to-red-600 rounded-full filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-8">
            <span className="text-cyan-400 font-semibold tracking-wider text-sm">PERFORMANCE COLLECTION</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
            GEAR FOR
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              CHAMPIONS
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Discover equipment engineered for peak performance. Every product tested by athletes, designed for victory.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for performance gear..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-8 py-4 bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative py-12 border-y border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedCategory === '' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
              }`}
            >
              ALL GEAR
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {searchTerm ? `Search Results for "${searchTerm}"` : 
                 selectedCategory ? categories.find(c => c.id == selectedCategory)?.name || 'Products' : 'All Products'}
              </h2>
              <p className="text-gray-400">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            
            {/* Sort Options */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Sort by:</span>
              <select className="bg-gray-800/50 border border-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50">
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-slide-in opacity-0"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-gray-400 mb-8">
                  {searchTerm 
                    ? `No products match "${searchTerm}". Try adjusting your search.`
                    : 'No products available in this category.'
                  }
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                  }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300"
                >
                  VIEW ALL PRODUCTS
                </button>
              </div>
            </div>
          )}

          {/* Performance Features */}
          {filteredProducts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-gray-800/50">
              <div className="text-center mb-16">
                <h3 className="text-3xl font-bold text-white mb-4">
                  WHY CHOOSE
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> OUR GEAR</span>
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Every product is engineered with cutting-edge technology and tested by professional athletes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: "⚡",
                    title: "Peak Performance",
                    description: "Engineered for maximum output and endurance in any condition."
                  },
                  {
                    icon: "🛡️",
                    title: "Durability Tested",
                    description: "Built to withstand the most demanding training sessions."
                  },
                  {
                    icon: "🚀",
                    title: "Innovation First",
                    description: "Latest technology meets proven athletic performance standards."
                  }
                ].map((feature, index) => (
                  <div key={index} className="text-center p-8 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;