// src/pages/orders/OrdersPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const ordersData = await ApiService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'from-yellow-400 to-orange-500',
      'PROCESSING': 'from-blue-400 to-cyan-500',
      'SHIPPED': 'from-purple-400 to-pink-500',
      'DELIVERED': 'from-green-400 to-emerald-500',
      'CANCELLED': 'from-red-400 to-red-600'
    };
    return colors[status] || 'from-gray-400 to-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PENDING': '⏳',
      'PROCESSING': '⚙️',
      'SHIPPED': '🚚',
      'DELIVERED': '✅',
      'CANCELLED': '❌'
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-black/50"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-4xl font-black text-white mb-6">
                NO ORDERS
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                  YET
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                Ready to start your championship journey? Explore our elite gear collection and place your first order.
              </p>
              <Link 
                to="/products" 
                className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
              >
                🛒 START SHOPPING
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
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">ORDER HISTORY</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              YOUR GEAR
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                JOURNEY
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Track your championship equipment orders. Every purchase brings you closer to athletic excellence.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {orders.length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">ORDERS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                  {orders.filter(o => o.order_status === 'DELIVERED').length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">DELIVERED</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  ${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm font-semibold">INVESTED</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Orders List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {orders.map((order, index) => (
              <div 
                key={order.id} 
                className="bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 animate-slide-in"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-800/50">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                        <span className="text-white font-bold text-xl">#{order.id}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Order #{order.id}</h3>
                        <p className="text-gray-400">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {/* Status Badge */}
                      <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor(order.order_status)} text-white font-bold text-sm shadow-lg flex items-center space-x-2`}>
                        <span>{getStatusIcon(order.order_status)}</span>
                        <span>{order.order_status}</span>
                      </div>
                      
                      {/* Total */}
                      <div className="text-right">
                        <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                          ${order.total}
                        </div>
                        <div className="text-gray-400 text-sm font-semibold">TOTAL</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Shipping Info */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="mr-2">🚚</span>
                        Shipping Details
                      </h4>
                      <div className="bg-gray-800/30 rounded-2xl p-4 space-y-2">
                        <p className="text-cyan-400 font-semibold">{order.full_name}</p>
                        <p className="text-gray-300 text-sm">{order.address}</p>
                        <p className="text-gray-300 text-sm">{order.city}, {order.state} {order.zip_code}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="mr-2">📦</span>
                        Items ({order.items.length})
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-4 bg-gray-800/30 rounded-xl p-3">
                            {item.product.image && (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded-lg border border-gray-700/50"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="text-white font-semibold text-sm">{item.product.name}</h5>
                              <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-cyan-400 font-bold">${item.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>👁️</span>
                      <span>View Details</span>
                    </button>
                    
                    {order.order_status === 'DELIVERED' && (
                      <button className="px-6 py-3 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2">
                        <span>⭐</span>
                        <span>Review Items</span>
                      </button>
                    )}
                    
                    {(order.order_status === 'PENDING' || order.order_status === 'PROCESSING') && (
                      <button className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2">
                        <span>❌</span>
                        <span>Cancel Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-800/50">
              <h3 className="text-3xl font-bold text-white">
                Order #{selectedOrder.id} Details
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-12 h-12 bg-gray-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-8">
              {/* Status and Timeline */}
              <div className="text-center">
                <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getStatusColor(selectedOrder.order_status)} text-white font-bold text-lg shadow-lg`}>
                  {getStatusIcon(selectedOrder.order_status)} {selectedOrder.order_status}
                </div>
              </div>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Customer Information</h4>
                  <div className="space-y-2">
                    <p className="text-cyan-400 font-semibold">{selectedOrder.full_name}</p>
                    <p className="text-gray-300">{selectedOrder.email}</p>
                    <p className="text-gray-300">{selectedOrder.phone_number}</p>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Shipping Address</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">{selectedOrder.address}</p>
                    <p className="text-gray-300">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip_code}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-800/30 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-white mb-6">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        {item.product.image && (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <p className="text-white font-semibold">{item.product.name}</p>
                          <p className="text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-cyan-400 font-bold text-lg">${item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Total */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl p-6 border border-cyan-500/20">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-white">Total:</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                    ${selectedOrder.total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;