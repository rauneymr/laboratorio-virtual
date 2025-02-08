const jwt = require('jsonwebtoken')
const UserService = require('../services/UserService')

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Extract token (assuming "Bearer TOKEN" format)
    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Token error' })
    }

    const token = parts[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Auth Middleware - Decoded Token:', { 
      id: decoded.id, 
      email: decoded.email,
      role: decoded.role
    });

    // Check if user exists
    const user = await UserService.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    console.log('Auth Middleware - User:', { 
      id: user.id, 
      email: user.email,
      role: user.role,
      status: user.status
    });

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    }

    // Check user status
    if (user.status !== 'APPROVED') {
      return res.status(403).json({ error: 'User account not approved' })
    }

    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }

    res.status(500).json({ error: 'Authentication failed' })
  }
}

module.exports = authMiddleware
