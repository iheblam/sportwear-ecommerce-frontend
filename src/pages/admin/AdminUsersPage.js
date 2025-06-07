// src/pages/admin/AdminUsersPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState({});
  const { user: currentUser } = useAuth();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await ApiService.getAdminUsers();
      setUsers(response.users || response);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete user: ${userEmail}?`)) {
      return;
    }

    setDeleting(prev => ({ ...prev, [userId]: true }));
    try {
      await ApiService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      showSuccess(`User ${userEmail} deleted successfully`);
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(error.message || 'Failed to delete user');
    } finally {
      setDeleting(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRoleBadge = (role) => {
    return role === 'ADMIN' ? (
      <span className="px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-400 rounded-full text-sm font-semibold border border-red-500/30">
        👑 ADMIN
      </span>
    ) : (
      <span className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
        🏆 USER
      </span>
    );
  };

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
              USER
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                MANAGEMENT
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Manage all registered athletes and administrators. Control access and monitor user activity across the platform.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center">
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {users.length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">TOTAL USERS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-500">
                  {users.filter(u => u.role === 'ADMIN').length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">ADMINS</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {users.filter(u => u.role === 'USER').length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">ATHLETES</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Users Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {users.map((user, index) => (
              <div 
                key={user.id} 
                className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-6 border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 animate-slide-in"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* User Avatar */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/25">
                      <span className="text-white font-black text-xl">
                        {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-white text-xs">
                        {user.role === 'ADMIN' ? '👑' : '🏆'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-bold text-white">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-gray-400">{user.email}</p>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Role</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Phone</span>
                    <span className="text-white font-semibold">{user.phone_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Location</span>
                    <span className="text-white font-semibold">
                      {user.city && user.state ? `${user.city}, ${user.state}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Joined</span>
                    <span className="text-white font-semibold">
                      {new Date(user.date_joined || user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-800/50">
                  {user.id !== currentUser?.id ? (
                    <button
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      disabled={deleting[user.id]}
                      className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
                    >
                      {deleting[user.id] ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                          </svg>
                          DELETING...
                        </div>
                      ) : (
                        '🗑️ DELETE USER'
                      )}
                    </button>
                  ) : (
                    <div className="w-full px-6 py-3 bg-green-500/20 text-green-400 font-semibold rounded-xl text-center border border-green-500/30">
                      👤 CURRENT USER
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50">
            <div className="p-8 border-b border-gray-800/50">
              <h2 className="text-3xl font-bold text-white mb-2">Detailed User Database</h2>
              <p className="text-gray-400">Complete user information and management controls</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      User Profile
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Role & Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Member Since
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/20 transition-colors duration-300">
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
                              <span className="text-white font-bold text-lg">
                                {user.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-bold text-white">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                            <div className="text-xs text-gray-500 mt-1">ID: {user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm text-white">{user.phone_number || 'Not provided'}</div>
                        <div className="text-sm text-gray-400">
                          {user.city && user.state ? `${user.city}, ${user.state}` : 'Location not set'}
                        </div>
                        {user.zip_code && (
                          <div className="text-xs text-gray-500">{user.zip_code}</div>
                        )}
                      </td>
                      <td className="px-6 py-6">
                        {getRoleBadge(user.role)}
                        <div className="mt-2">
                          <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
                            ACTIVE
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-300">
                        {new Date(user.date_joined || user.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-6">
                        {user.id !== currentUser?.id ? (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            disabled={deleting[user.id]}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500/30 hover:border-red-500/50"
                          >
                            {deleting[user.id] ? (
                              <div className="flex items-center">
                                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                </svg>
                                Deleting...
                              </div>
                            ) : (
                              '🗑️ Delete'
                            )}
                          </button>
                        ) : (
                          <span className="px-4 py-2 bg-green-500/20 text-green-400 font-semibold rounded-lg border border-green-500/30">
                            Current User
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Users Found</h3>
                <p className="text-gray-400">
                  The user database is empty. Users will appear here once they register.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Admin Features */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              ADMIN
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> CAPABILITIES</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Powerful tools to manage your elite athlete community with precision and control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "User Management",
                description: "Complete control over user accounts, roles, and permissions across the platform."
              },
              {
                icon: "🛡️",
                title: "Security Control",
                description: "Monitor and manage security settings, access controls, and user authentication."
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                description: "Track user engagement, performance metrics, and platform usage statistics."
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

export default AdminUsersPage;