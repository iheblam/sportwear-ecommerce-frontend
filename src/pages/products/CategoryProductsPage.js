// src/pages/products/CategoryProductsPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ApiService from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryProducts();
  }, [categoryId]);

  const fetchCategoryProducts = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getProductsByCategory(categoryId),
        ApiService.getCategories()
      ]);
      setProducts(productsData);
      
      const category = categoriesData.find(cat => cat.id == categoryId);
      setCategoryName(category ? category.name : 'Category');
      setCategoryImage(category ? category.image : '');
    } catch (error) {
      console.error('Error fetching category products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image */}
        {categoryImage && (
          <div className="absolute inset-0">
            <img 
              src={categoryImage} 
              alt={categoryName}
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"></div>
          </div>
        )}
        
        {/* Animated Background */}
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
                <Link to="/categories" className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                  Categories
                </Link>
              </li>
              <li>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li>
                <span className="text-cyan-400 font-semibold">{categoryName}</span>
              </li>
            </ol>
          </nav>

          <div className="text-center">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-8">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">ELITE CATEGORY</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
              {categoryName}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-3xl md:text-4xl mt-2">
                COLLECTION
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Specialized gear engineered for peak performance in {categoryName.toLowerCase()}. Every product tested by champions.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {products.length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">PRODUCTS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  100%
                </div>
                <div className="text-gray-400 text-sm font-semibold">ELITE</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  PRO
                </div>
                <div className="text-gray-400 text-sm font-semibold">TESTED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              {/* Section Header */}
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-white mb-4">
                  PERFORMANCE
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> GEAR</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Discover equipment that transforms good athletes into champions. Each product represents the pinnacle of {categoryName.toLowerCase()} technology.
                </p>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-slide-in opacity-0"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'forwards'
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              {/* Performance Features */}
              <div className="mt-24 pt-16 border-t border-gray-800/50">
                <div className="text-center mb-16">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    WHY {categoryName.toUpperCase()}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> EXCELLENCE</span>
                  </h3>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Our {categoryName.toLowerCase()} collection represents the cutting edge of athletic performance technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      icon: "🎯",
                      title: "Precision Engineering",
                      description: `Every ${categoryName.toLowerCase()} product is designed with millimeter precision for optimal performance.`
                    },
                    {
                      icon: "⚡",
                      title: "Lightning Performance",
                      description: "Materials and design optimized for speed, agility, and endurance in competitive environments."
                    },
                    {
                      icon: "🔥",
                      title: "Champion Tested",
                      description: "Proven in competition by professional athletes who demand nothing but the best."
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
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Products Found</h3>
                <p className="text-gray-400 mb-8">
                  This {categoryName.toLowerCase()} collection is being prepared with championship-level gear.
                </p>
                <Link
                  to="/products"
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
                >
                  EXPLORE ALL PRODUCTS
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryProductsPage;