// src/pages/admin/AdminOrdersPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [updating, setUpdating] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await ApiService.getAdminOrders(statusFilter);
      setOrders(response.orders || response);
    } catch (error) {
      console.error('Error fetching orders:', error);
      showError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus, sendNotification = false) => {
    setUpdating(prev => ({ ...prev, [orderId]: true }));
    try {
      await ApiService.updateOrderStatus(orderId, newStatus, sendNotification);
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, order_status: newStatus }
          : order
      ));
      showSuccess(`Order #${orderId} status updated to ${newStatus}! 🚀`);
    } catch (error) {
      console.error('Error updating order status:', error);
      showError(error.message || 'Failed to update order status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      return;
    }

    try {
      await ApiService.deleteOrder(orderId);
      setOrders(prev => prev.filter(order => order.id !== orderId));
      showSuccess(`Order #${orderId} deleted successfully! 🗑️`);
    } catch (error) {
      console.error('Error deleting order:', error);
      showError(error.message || 'Failed to delete order');
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

  const orderStatuses = [
    { value: '', label: 'All Orders', count: orders.length },
    { value: 'PENDING', label: 'Pending', count: orders.filter(o => o.order_status === 'PENDING').length },
    { value: 'PROCESSING', label: 'Processing', count: orders.filter(o => o.order_status === 'PROCESSING').length },
    { value: 'SHIPPED', label: 'Shipped', count: orders.filter(o => o.order_status === 'SHIPPED').length },
    { value: 'DELIVERED', label: 'Delivered', count: orders.filter(o => o.order_status === 'DELIVERED').length },
    { value: 'CANCELLED', label: 'Cancelled', count: orders.filter(o => o.order_status === 'CANCELLED').length }
  ];

  if (loading) {
    return <LoadingSpinner />;
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
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">ADMIN CONTROL</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-6">
              ORDER
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                MANAGEMENT
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Command center for all athlete orders. Track, update, and manage the flow of championship gear to your elite customers.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {orders.length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">TOTAL ORDERS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {orders.filter(o => o.order_status === 'DELIVERED').length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">DELIVERED</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  ${orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2)}
                </div>
                <div className="text-gray-400 text-sm font-semibold">REVENUE</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Status Filter */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Filter by Status</h2>
            <div className="flex flex-wrap gap-4">
              {orderStatuses.map(status => (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                    statusFilter === status.value
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'bg-gray-800/50 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 border border-gray-700/50'
                  }`}
                >
                  <span>{status.label}</span>
                  <span className="px-2 py-1 bg-white/20 rounded-full text-xs font-bold">
                    {status.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          <div className="space-y-6">
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
                        <span className="text-white font-bold text-lg">#{order.id}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">Order #{order.id}</h3>
                        <p className="text-gray-400">
                          {order.full_name} • {new Date(order.created_at).toLocaleDateString('en-US', {
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
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Customer Info */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="mr-2">👤</span>
                        Customer Details
                      </h4>
                                              <div className="bg-gray-800/30 rounded-2xl p-4 space-y-2">
                        <p className="text-cyan-400 font-semibold">{order.full_name}</p>
                        <p className="text-gray-300 text-sm">{order.email}</p>
                        <p className="text-gray-300 text-sm">{order.phone_number}</p>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="mr-2">🚚</span>
                        Shipping Address
                      </h4>
                      <div className="bg-gray-800/30 rounded-2xl p-4 space-y-2">
                        <p className="text-gray-300 text-sm">{order.address}</p>
                        <p className="text-gray-300 text-sm">{order.city}, {order.state} {order.zip_code}</p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                        <span className="mr-2">📦</span>
                        Items ({order.items?.length || 0})
                      </h4>
                      <div className="space-y-3 max-h-32 overflow-y-auto">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 bg-gray-800/30 rounded-xl p-3">
                            {item.product.image && (
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-10 h-10 object-cover rounded-lg border border-gray-700/50"
                              />
                            )}
                            <div className="flex-1">
                              <h5 className="text-white font-semibold text-sm">{item.product.name}</h5>
                              <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-cyan-400 font-bold text-sm">${item.price}</div>
                          </div>
                        )) || (
                          <p className="text-gray-400 text-sm">No items available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 border border-cyan-500/30 hover:border-cyan-500/50"
                    >
                      <span>👁️</span>
                      <span>View Details</span>
                    </button>
                    
                    {order.order_status !== 'DELIVERED' && order.order_status !== 'CANCELLED' && (
                      <select
                        value={order.order_status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value, true)}
                        disabled={updating[order.id]}
                        className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                      >
                        <option value="PENDING">Pending</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                    
                    {(order.order_status === 'PENDING' || order.order_status === 'CANCELLED') && (
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-300 flex items-center space-x-2 border border-red-500/30 hover:border-red-500/50"
                      >
                        <span>🗑️</span>
                        <span>Delete Order</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {orders.length === 0 && (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Orders Found</h3>
              <p className="text-gray-400">
                {statusFilter ? `No orders with status: ${statusFilter}` : 'No orders have been placed yet by athletes.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-2">👤</span>
                    Customer Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-cyan-400 font-semibold">{selectedOrder.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white">{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white">{selectedOrder.phone_number}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/30 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4 flex items-center">
                    <span className="mr-2">🚚</span>
                    Shipping Address
                  </h4>
                  <div className="space-y-2">
                    <p className="text-gray-300">{selectedOrder.address}</p>
                    <p className="text-gray-300">{selectedOrder.city}, {selectedOrder.state} {selectedOrder.zip_code}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-gray-800/30 rounded-2xl p-6">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center">
                  <span className="mr-2">📦</span>
                  Order Items
                </h4>
                <div className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                      <div className="flex items-center space-x-4">
                        {item.product.image && (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-600/50"
                          />
                        )}
                        <div>
                          <p className="text-white font-semibold">{item.product.name}</p>
                          <p className="text-gray-400">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="text-cyan-400 font-bold text-lg">${item.price}</p>
                    </div>
                  )) || (
                    <p className="text-gray-400">No items available</p>
                  )}
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

              {/* Order Management Actions */}
              <div className="flex flex-wrap gap-4">
                {selectedOrder.order_status !== 'DELIVERED' && selectedOrder.order_status !== 'CANCELLED' && (
                  <select
                    value={selectedOrder.order_status}
                    onChange={(e) => {
                      handleStatusUpdate(selectedOrder.id, e.target.value, true);
                      setSelectedOrder({...selectedOrder, order_status: e.target.value});
                    }}
                    disabled={updating[selectedOrder.id]}
                    className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                )}
                
                {(selectedOrder.order_status === 'PENDING' || selectedOrder.order_status === 'CANCELLED') && (
                  <button
                    onClick={() => {
                      handleDeleteOrder(selectedOrder.id);
                      setSelectedOrder(null);
                    }}
                    className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                  >
                    🗑️ Delete Order
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Management Features */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              ORDER
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> COMMAND</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Complete control over your order fulfillment process. Track, manage, and optimize every customer journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Real-time Tracking",
                description: "Monitor order status, customer communications, and fulfillment progress in real-time."
              },
              {
                icon: "⚡",
                title: "Instant Updates",
                description: "Update order status with automatic customer notifications and tracking updates."
              },
              {
                icon: "🎯",
                title: "Performance Analytics",
                description: "Track fulfillment metrics, customer satisfaction, and order processing efficiency."
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
    </div>
  );
};

export default AdminOrdersPage;