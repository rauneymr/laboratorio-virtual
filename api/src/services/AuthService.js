const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const UserRepository = require('../repositories/UserRepository')

class AuthService {
  /**
   * Generate JWT token
   * @param {Object} user - User object
   * @returns {string} JWT token
   */
  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: '24h' 
      }
    )
  }

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} User data and token
   */
  async login(email, password) {
    // Find user by email
    const user = await UserRepository.findByEmail(email)
    if (!user) {
      throw new Error('Invalid credentials')
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid credentials')
    }

    // Check user status
    if (user.status !== 'APPROVED') {
      throw new Error('User account not approved')
    }

    // Generate token
    const token = this.generateToken(user)

    // Remove sensitive information
    const { password: _, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token
   */
  async verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await UserRepository.findById(decoded.id)

      if (!user) {
        throw new Error('User not found')
      }

      return decoded
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}

module.exports = new AuthService()
