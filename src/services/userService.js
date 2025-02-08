import api from './api'

const userService = {
  /**
   * Create a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Created user data
   */
  async register(userData) {
    try {
      console.log('[UserService] Attempting to register user:', userData.email)
      const response = await api.post('/users', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'USER', // Default to USER role if not specified
        status: 'PENDING' // Default status for new users
      })

      console.log('[UserService] User registration successful:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] User registration error:', error.response?.data || error.message)
      
      // Handle specific error cases
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.error || 'User already exists')
      }
      
      throw error
    }
  },

  /**
   * Get user profile
   * @returns {Promise<Object>} User profile data
   */
  async getProfile() {
    try {
      console.log('[UserService] Fetching user profile')
      const response = await api.get('/users/profile')
      
      console.log('[UserService] User profile retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error fetching user profile:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user data
   */
  async updateProfile(userData) {
    try {
      console.log('[UserService] Attempting to update user profile')
      const response = await api.put('/users/profile', userData)
      
      console.log('[UserService] User profile updated:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error updating user profile:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Get all users (admin only)
   * @returns {Promise<Array>} List of users
   */
  async getAllUsers() {
    try {
      console.log('[UserService] Fetching all users')
      const response = await api.get('/users')
      
      console.log('[UserService] Users retrieved:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error fetching users:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Disable a user
   * @param {string} userId - ID of the user to disable
   * @param {string} [reason] - Optional reason for disabling
   * @returns {Promise<Object>} Updated user data
   */
  async disableUser(userId, reason = '') {
    try {
      console.log(`[UserService] Disabling user ${userId}`)
      const response = await api.patch(`/users/${userId}/disable`, { reason })
      
      console.log('[UserService] User disabled:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error disabling user:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Enable a previously disabled user
   * @param {string} userId - ID of the user to enable
   * @returns {Promise<Object>} Updated user data
   */
  async enableUser(userId) {
    try {
      console.log(`[UserService] Enabling user ${userId}`)
      const response = await api.patch(`/users/${userId}/enable`)
      
      console.log('[UserService] User enabled:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error enabling user:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Approve a user registration request
   * @param {string} userId - ID of the user to approve
   * @returns {Promise<Object>} Updated user data
   */
  async approveUser(userId) {
    try {
      console.log(`[UserService] Approving user ${userId}`)
      const response = await api.patch(`/users/${userId}/approve`)
      
      console.log('[UserService] User approved:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error approving user:', error.response?.data || error.message)
      throw error
    }
  },

  /**
   * Reject a user registration request
   * @param {string} userId - ID of the user to reject
   * @param {string} [reason] - Optional reason for rejection
   * @returns {Promise<Object>} Updated user data
   */
  async rejectUser(userId, reason = '') {
    try {
      console.log(`[UserService] Rejecting user ${userId}`)
      const response = await api.patch(`/users/${userId}/reject`, { reason })
      
      console.log('[UserService] User rejected:', response.data)
      return response.data
    } catch (error) {
      console.error('[UserService] Error rejecting user:', error.response?.data || error.message)
      throw error
    }
  }
}

export default userService
