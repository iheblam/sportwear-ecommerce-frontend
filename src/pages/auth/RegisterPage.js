// src/pages/auth/RegisterPage.js - Futuristic SportWear Design
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { register } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Client-side validation
    if (formData.password !== formData.password2) {
      showError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      showWarning('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      
      showSuccess(`🎉 Welcome to the elite ranks, ${response.user.first_name}! Your champion account is ready for action.`);
      
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Registration failed:', error);
      showError(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(2);
  };

  const prevStep = () => {
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-16 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-red-600/20 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Athletic Grid Pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-full border border-cyan-500/30 mb-6">
              <span className="text-cyan-400 font-semibold tracking-wider text-sm">JOIN THE ELITE</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              BECOME A
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                CHAMPION
              </span>
            </h2>
            
            <p className="text-gray-300 text-lg">
              Create your elite athlete account and dominate the competition
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className={`flex items-center ${currentStep >= 1 ? 'text-cyan-400' : 'text-gray-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 1 ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-600'
                }`}>
                  <span className="font-bold">1</span>
                </div>
                <span className="ml-2 font-semibold">Personal Info</span>
              </div>
              <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-cyan-400' : 'bg-gray-600'} rounded`}></div>
              <div className={`flex items-center ${currentStep >= 2 ? 'text-cyan-400' : 'text-gray-600'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  currentStep >= 2 ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-600'
                }`}>
                  <span className="font-bold">2</span>
                </div>
                <span className="ml-2 font-semibold">Address & Details</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800/50 p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Basic Information</h3>
                    <p className="text-gray-400">Let's start with your champion credentials</p>
                  </div>

                  {/* Name Fields */}
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
                        placeholder="Champion first name"
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
                        placeholder="Champion last name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-cyan-400 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="your.elite@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
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
                      placeholder="Champion contact number"
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="password" className="block text-sm font-semibold text-cyan-400 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="password"
                          required
                          minLength="8"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                          placeholder="Strong champion password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-cyan-400 transition-colors duration-300"
                        >
                          {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                          ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                    </div>

                    <div>
                      <label htmlFor="password2" className="block text-sm font-semibold text-cyan-400 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password2"
                        id="password2"
                        required
                        value={formData.password2}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Confirm your password"
                      />
                    </div>
                  </div>

                  {/* Continue Button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={nextStep}
                      disabled={!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password2}
                      className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/25"
                    >
                      CONTINUE TO STEP 2 →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Address & Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Address & Details</h3>
                    <p className="text-gray-400">Complete your champion profile</p>
                  </div>

                  {/* Address */}
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
                      placeholder="Your champion headquarters address"
                    />
                  </div>

                  {/* Location Fields */}
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
                        placeholder="Champion City"
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

                  {/* Terms and Elite Benefits */}
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-2xl p-6 border border-cyan-500/20">
                    <div className="flex items-center mb-4">
                      <span className="text-cyan-400 mr-2">🏆</span>
                      <span className="text-cyan-400 font-semibold">ELITE MEMBER BENEFITS</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        Free shipping on all orders
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        Early access to new gear
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        Champion support priority
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        Performance tracking tools
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 px-8 py-4 border-2 border-gray-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 font-semibold rounded-xl transition-all duration-300"
                    >
                      ← BACK
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-cyan-500/25"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          CREATING CHAMPION...
                        </div>
                      ) : (
                        '🚀 CREATE ELITE ACCOUNT'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900/50 text-gray-400">Already a champion?</span>
                </div>
              </div>
              <div className="mt-6">
                <Link 
                  to="/login" 
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300"
                >
                  🏆 SIGN IN TO YOUR ACCOUNT
                </Link>
              </div>
            </div>

            {/* Security Features */}
            <div className="mt-8 pt-6 border-t border-gray-800/50">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-green-400 mb-2">🔒</div>
                  <div className="text-xs text-gray-400 font-semibold">SECURE</div>
                </div>
                <div>
                  <div className="text-blue-400 mb-2">⚡</div>
                  <div className="text-xs text-gray-400 font-semibold">INSTANT</div>
                </div>
                <div>
                  <div className="text-purple-400 mb-2">🏆</div>
                  <div className="text-xs text-gray-400 font-semibold">ELITE</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              Join the elite community of athletes who trust SportWear.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;