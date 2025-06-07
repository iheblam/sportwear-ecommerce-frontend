// src/pages/profile/ProfilePage.js - Futuristic Athlete Profile Design
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await ApiService.updateProfile(formData);
      
      if (setUser && response.user) {
        setUser(response.user);
      }
      
      showSuccess('Profile updated successfully! 🎉');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black/50"></div>
        
        {/* Dynamic Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-16 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-36 h-36 bg-gradient-to-br from-orange-400 to-red-600 rounded-full filter blur-xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Profile Avatar */}
            <div className="inline-block relative mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/25 border-4 border-cyan-400/30">
                <span className="text-white font-black text-4xl">
                  {user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center border-4 border-black">
                <span className="text-white text-xs font-bold">
                  {user?.role === 'ADMIN' ? '👑' : '🏆'}
                </span>
              </div>
            </div>

            <div className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full border border-cyan-500/30 mb-6">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">
                {user?.role === 'ADMIN' ? 'ELITE ADMINISTRATOR' : 'CHAMPION ATHLETE'}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4">
              {user?.first_name || 'ATHLETE'}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-3xl md:text-4xl mt-2">
                PROFILE
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Manage your champion profile and performance settings. Every detail matters in your journey to excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-800/50">
              <div className="flex space-x-2">
                {[
                  { id: 'profile', label: 'Profile Settings', icon: '👤' },
                  { id: 'stats', label: 'Account Stats', icon: '📊' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                        : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Settings Tab */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Personal Information</h2>
                    <p className="text-gray-400">Update your athlete profile and performance data</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-semibold text-cyan-400 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          id="first_name"
                          required
                          value={formData.first_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="Enter your first name"
                        />
                      </div>

                      <div>
                        <label htmlFor="last_name" className="block text-sm font-semibold text-cyan-400 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          id="last_name"
                          required
                          value={formData.last_name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    {/* Contact Section */}
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
                        placeholder="Enter your email"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone_number" className="block text-sm font-semibold text-cyan-400 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Address Section */}
                    <div>
                      <label htmlFor="address" className="block text-sm font-semibold text-cyan-400 mb-2">
                        Address
                      </label>
                      <textarea
                        name="address"
                        id="address"
                        rows={3}
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                        placeholder="Enter your address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-semibold text-cyan-400 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={formData.city}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="City"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-semibold text-cyan-400 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={formData.state}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="State"
                        />
                      </div>

                      <div>
                        <label htmlFor="zip_code" className="block text-sm font-semibold text-cyan-400 mb-2">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={formData.zip_code}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="ZIP"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/25"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            UPDATING PROFILE...
                          </div>
                        ) : (
                          '🚀 UPDATE PROFILE'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Side Panel */}
              <div className="space-y-6">
                {/* Profile Summary */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4">Profile Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Status</span>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        ACTIVE
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Member Since</span>
                      <span className="text-white font-semibold">
                        {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Account Type</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user?.role === 'ADMIN' 
                          ? 'bg-red-500/20 text-red-400' 
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {user?.role === 'ADMIN' ? 'ADMINISTRATOR' : 'ATHLETE'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/50">
                  <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 rounded-xl transition-all duration-300 text-left">
                      🔒 Change Password
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-purple-500/10 text-gray-300 hover:text-purple-400 rounded-xl transition-all duration-300 text-left">
                      🔔 Notification Settings
                    </button>
                    <button className="w-full px-4 py-3 bg-gray-800/50 hover:bg-orange-500/10 text-gray-300 hover:text-orange-400 rounded-xl transition-all duration-300 text-left">
                      🏆 Performance Goals
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Stats Tab */}
          {activeTab === 'stats' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-800/50">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-white mb-2">Account Statistics</h2>
                  <p className="text-gray-400">Your performance metrics and account analytics</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Account ID', value: user?.id || 'N/A', icon: '🔢', color: 'cyan' },
                    { label: 'Orders Placed', value: '12', icon: '📦', color: 'purple' },
                    { label: 'Total Spent', value: '$1,247', icon: '💰', color: 'green' },
                    { label: 'Member Level', value: user?.role === 'ADMIN' ? 'ELITE' : 'PRO', icon: '⭐', color: 'orange' }
                  ].map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300">
                      <div className="text-3xl mb-3">{stat.icon}</div>
                      <div className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${
                        stat.color === 'cyan' ? 'from-cyan-400 to-blue-500' :
                        stat.color === 'purple' ? 'from-purple-400 to-pink-500' :
                        stat.color === 'green' ? 'from-green-400 to-emerald-500' :
                        'from-orange-400 to-red-500'
                      } mb-2`}>
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-sm font-semibold">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Account Activity</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-gray-300">Last Login</span>
                        <span className="text-cyan-400 font-semibold">Today</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-gray-300">Profile Completion</span>
                        <span className="text-green-400 font-semibold">95%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-gray-300">Security Score</span>
                        <span className="text-purple-400 font-semibold">Excellent</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-4">Achievements</h4>
                    <div className="space-y-4">
                      <div className="flex items-center p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-2xl mr-4">🏆</span>
                        <div>
                          <div className="text-white font-semibold">Champion Member</div>
                          <div className="text-gray-400 text-sm">Joined the elite ranks</div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-2xl mr-4">⚡</span>
                        <div>
                          <div className="text-white font-semibold">Speed Demon</div>
                          <div className="text-gray-400 text-sm">Lightning fast checkouts</div>
                        </div>
                      </div>
                      <div className="flex items-center p-4 bg-gray-800/30 rounded-xl">
                        <span className="text-2xl mr-4">🔥</span>
                        <div>
                          <div className="text-white font-semibold">Gear Collector</div>
                          <div className="text-gray-400 text-sm">Multiple categories mastered</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;