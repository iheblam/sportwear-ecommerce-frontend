// src/services/api.js - Fixed Product Update Issue
const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  static getAuthHeader() {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        ...this.getAuthHeader(),
        ...options.headers,
      },
      ...options,
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!(options.body instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return;
      }

      const data = await response.json();
      
      if (!response.ok) {
        let errorMessage = 'Something went wrong';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          const errors = [];
          Object.keys(data).forEach(key => {
            if (Array.isArray(data[key])) {
              errors.push(`${key}: ${data[key].join(', ')}`);
            } else {
              errors.push(`${key}: ${data[key]}`);
            }
          });
          if (errors.length > 0) {
            errorMessage = errors.join('; ');
          }
        }
        
        throw new Error(errorMessage);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  static async get(endpoint) {
    return this.request(endpoint);
  }

  static async post(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: 'POST',
      body: body,
    });
  }

  static async put(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: 'PUT',
      body: body,
    });
  }

  static async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Helper method to create FormData for file uploads
  static createFormData(data, imageFile) {
    const formData = new FormData();
    
    // Add all text fields
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    
    // Add image file if provided
    if (imageFile) {
      formData.append('image', imageFile);
    }
    
    return formData;
  }

  // Auth endpoints
  static async login(email, password) {
    return this.request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData) {
    return this.request('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async getProfile() {
    return this.get('/auth/profile/');
  }

  static async updateProfile(userData) {
    return this.put('/auth/profile/', userData);
  }

  // Products endpoints
  static async getCategories() {
    return this.get('/products/categories/');
  }

  static async getProducts() {
    return this.get('/products/newest/');
  }

  static async getProductsByCategory(categoryId) {
    return this.get(`/products/categories/${categoryId}/products/`);
  }

  static async getProduct(id) {
    return this.get(`/products/products/${id}/`);
  }

  // Cart endpoints
  static async getCart() {
    return this.get('/cart/');
  }

  static async addToCart(productId, quantity = 1) {
    return this.post('/cart/add/', { product_id: productId, quantity });
  }

  static async updateCartItem(itemId, quantity) {
    return this.put(`/cart/update/${itemId}/`, { quantity });
  }

  static async removeFromCart(itemId) {
    return this.delete(`/cart/remove/${itemId}/`);
  }

  // Orders endpoints
  static async getOrders() {
    return this.get('/orders/');
  }

  static async createOrder(orderData) {
    return this.post('/orders/create/', orderData);
  }

  static async getOrder(orderId) {
    return this.get(`/orders/${orderId}/`);
  }

  // ========== ADMIN ENDPOINTS ==========

  // Admin Users Management
  static async getAdminUsers() {
    return this.get('/auth/admin/users/');
  }

  static async deleteUser(userId) {
    return this.delete(`/auth/admin/users/${userId}/`);
  }

  static async updateUser(userId, userData) {
    return this.put(`/auth/admin/users/${userId}/edit/`, userData);
  }

  // Admin Products Management
  static async getAdminProducts() {
    return this.get('/products/admin/products/');
  }

  static async createProduct(productData, imageFile = null) {
    // Always use FormData for creating products to handle potential image uploads
    const formData = this.createFormData(productData, imageFile);
    return this.post('/products/admin/products/', formData);
  }

  static async updateProduct(productId, productData, imageFile = null) {
    // For updates, check if we have an image file
    if (imageFile) {
      // If we have a new image, use FormData
      const formData = this.createFormData(productData, imageFile);
      return this.put(`/products/admin/products/${productId}/`, formData);
    } else {
      // If no new image, send regular JSON data
      return this.put(`/products/admin/products/${productId}/`, productData);
    }
  }

  static async deleteProduct(productId) {
    return this.delete(`/products/admin/products/${productId}/`);
  }

  // Admin Categories Management
  static async getAdminCategories() {
    return this.get('/products/admin/categories/');
  }

  static async createCategory(categoryData, imageFile = null) {
    // Always use FormData for creating categories to handle potential image uploads
    const formData = this.createFormData(categoryData, imageFile);
    return this.post('/products/admin/categories/', formData);
  }

  static async updateCategory(categoryId, categoryData, imageFile = null) {
    // For updates, check if we have an image file
    if (imageFile) {
      // If we have a new image, use FormData
      const formData = this.createFormData(categoryData, imageFile);
      return this.put(`/products/admin/categories/${categoryId}/`, formData);
    } else {
      // If no new image, send regular JSON data
      return this.put(`/products/admin/categories/${categoryId}/`, categoryData);
    }
  }

  static async deleteCategory(categoryId) {
    return this.delete(`/products/admin/categories/${categoryId}/`);
  }

  // Admin Orders Management
  static async getAdminOrders(status = null) {
    const endpoint = status ? `/orders/admin/?status=${status}` : '/orders/admin/';
    return this.get(endpoint);
  }

  static async updateOrderStatus(orderId, status, sendNotification = false) {
    return this.put(`/orders/admin/${orderId}/`, {
      order_status: status,
      send_notification: sendNotification
    });
  }

  static async deleteOrder(orderId) {
    return this.delete(`/orders/admin/${orderId}/`);
  }

  static async getAdminOrderDetail(orderId) {
    return this.get(`/orders/admin/${orderId}/`);
  }
}

export default ApiService;