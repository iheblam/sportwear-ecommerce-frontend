// src/pages/admin/AdminCategoriesPage.js - Futuristic Design
import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import ApiService from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    is_active: true
  });
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAdminCategories();
      setCategories(response.categories || response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await ApiService.updateCategory(editingCategory.id, formData, imageFile);
        showSuccess('Category updated successfully! 🚀');
      } else {
        await ApiService.createCategory(formData, imageFile);
        showSuccess('Category created successfully! 🎉');
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      showError(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      is_active: category.is_active
    });
    setImagePreview(category.image || '');
    setImageFile(null);
    setShowAddForm(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"? This will also affect all products in this category.`)) {
      return;
    }

    try {
      await ApiService.deleteCategory(categoryId);
      setCategories(prev => prev.filter(c => c.id !== categoryId));
      showSuccess('Category deleted successfully! 🗑️');
    } catch (error) {
      console.error('Error deleting category:', error);
      showError(error.message || 'Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      is_active: true
    });
    setEditingCategory(null);
    setImageFile(null);
    setImagePreview('');
    setShowAddForm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
              CATEGORY
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                MANAGEMENT
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
              Organize your championship gear into powerful categories. Create battlefields where athletes find their perfect equipment.
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-8 text-center mb-8">
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                  {categories.length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">CATEGORIES</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                  {categories.filter(c => c.is_active).length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">ACTIVE</div>
              </div>
              <div>
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                  {categories.filter(c => !c.is_active).length}
                </div>
                <div className="text-gray-400 text-sm font-semibold">INACTIVE</div>
              </div>
            </div>

            {/* Add Category Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
            >
              ➕ ADD NEW CATEGORY
            </button>
          </div>
        </div>
      </section>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-8 border-b border-gray-800/50">
              <h3 className="text-3xl font-bold text-white">
                {editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}
              </h3>
              <button
                onClick={resetForm}
                className="w-12 h-12 bg-gray-800/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Name */}
                <div>
                  <label className="block text-sm font-semibold text-cyan-400 mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    placeholder="Enter elite category name"
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="h-5 w-5 text-cyan-500 focus:ring-cyan-400 border-gray-600 rounded bg-gray-800"
                  />
                  <label className="ml-3 text-white font-semibold">
                    Active (visible to athletes)
                  </label>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-cyan-400 mb-2">
                    Category Image
                  </label>
                  <div className="border-2 border-dashed border-gray-700/50 rounded-xl p-6 text-center hover:border-cyan-500/50 transition-colors duration-300">
                    {imagePreview ? (
                      <div className="mb-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="mx-auto h-32 w-32 object-cover rounded-xl border-2 border-cyan-500/30"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                    <div className="text-gray-300">
                      <label htmlFor="image-upload" className="cursor-pointer font-semibold text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
                        {imagePreview ? 'Change category image' : 'Upload championship category image'}
                        <input 
                          id="image-upload" 
                          name="image-upload" 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-8 py-4 border-2 border-gray-700/50 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/50 font-semibold rounded-xl transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
                  >
                    {editingCategory ? '✏️ Update Category' : '🚀 Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {categories.map((category, index) => (
              <div 
                key={category.id} 
                className="bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105 animate-slide-in"
                style={{animationDelay: `${index * 100}ms`}}
              >
                {/* Category Image */}
                <div className="relative aspect-[4/5]">
                  {category.image ? (
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      category.is_active 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {category.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>

                  {/* Category Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-black text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mb-4"></div>
                    <p className="text-gray-300 text-sm">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="flex-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id, category.name)}
                      className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-800/50">
            <div className="p-8 border-b border-gray-800/50">
              <h2 className="text-3xl font-bold text-white mb-2">Category Database</h2>
              <p className="text-gray-400">Complete category management system with full control</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-800/20 transition-colors duration-300">
                      <td className="px-6 py-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-16">
                            {category.image ? (
                              <img className="h-16 w-16 rounded-xl object-cover border border-gray-700/50" src={category.image} alt={category.name} />
                            ) : (
                              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center border border-gray-700/50">
                                <svg className="h-8 w-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-lg font-bold text-white">{category.name}</div>
                            <div className="text-xs text-gray-500">ID: {category.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          category.is_active 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}>
                          {category.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-300">
                        {new Date(category.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {categories.length === 0 && (
              <div className="text-center py-20">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No Categories Found</h3>
                <p className="text-gray-400 mb-8">
                  Start organizing your championship gear by creating your first category.
                </p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:scale-105 transition-all duration-300"
                >
                  ➕ CREATE FIRST CATEGORY
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Features */}
      <section className="py-20 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-white mb-4">
              CATEGORY
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"> POWER</span>
            </h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Organize your product empire with precision. Create battlefields where champions find their perfect gear.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎯",
                title: "Strategic Organization",
                description: "Group products into powerful categories that guide athletes to their perfect gear selection."
              },
              {
                icon: "⚡",
                title: "Performance Optimization",
                description: "Streamline the shopping experience with intelligent categorization and instant navigation."
              },
              {
                icon: "🔥",
                title: "Brand Consistency",
                description: "Maintain visual hierarchy and brand identity across all category presentations."
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

export default AdminCategoriesPage;