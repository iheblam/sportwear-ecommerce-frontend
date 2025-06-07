// src/components/product/ProductCard.js - With Cart Context
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import { useToast } from '../../components/common/Toast';

const ProductCard = ({ product }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation to product detail
    
    if (!user) {
      showError('Please login to add items to cart');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(product.id, 1);
      showSuccess(`${product.name} added to cart! 🛒`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Error adding product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/product/${product.id}`} className="block">
        <div className="card hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
          {product.image && (
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
            
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-primary-600">${product.price}</span>
              
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !user}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
                  ${user 
                    ? 'bg-primary-600 hover:bg-primary-700 text-white hover:scale-105' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }
                  ${addingToCart ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {addingToCart ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : user ? (
                  '🛒 Add to Cart'
                ) : (
                  '🔒 Login to Buy'
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;