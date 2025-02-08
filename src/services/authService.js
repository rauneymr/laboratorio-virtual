import api from './api';

export const authService = {
  async register(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Registration Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error.response?.data || new Error('Registration failed');
    }
  },

  async login(credentials) {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', credentials);
      
      // Log successful login details
      console.log('Login Response:', {
        userId: response.data.id,
        role: response.data.role,
        status: response.data.status
      });
      
      return response.data;
    } catch (error) {
      console.error('Login Error:', {
        url: error.config?.url,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Throw specific error message if available
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      
      throw new Error('Login failed');
    }
  },

  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      
      // Log user details
      console.log('Current User:', {
        id: response.data.id,
        email: response.data.email,
        role: response.data.role,
        status: response.data.status
      });
      
      return response.data;
    } catch (error) {
      console.error('Get Current User Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error.response?.data || new Error('Failed to fetch user');
    }
  }
};

export default authService;
