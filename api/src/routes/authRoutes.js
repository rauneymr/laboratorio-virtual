const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');
const authMiddleware = require('../middleware/authMiddleware');
require('dotenv').config(); // Ensure environment variables are loaded

const router = express.Router();

// Robust secret retrieval with multiple fallback mechanisms
const getJwtSecret = () => {
  const secrets = [
    process.env.JWT_SECRET,
    process.env.VITE_JWT_SECRET,
    'default_secret_never_use_in_production'
  ];

  for (const secret of secrets) {
    if (secret && secret.trim() !== '') {
      console.log('JWT Secret Selected:', { 
        secretSource: secret === process.env.JWT_SECRET 
          ? 'process.env.JWT_SECRET' 
          : (secret === process.env.VITE_JWT_SECRET 
            ? 'process.env.VITE_JWT_SECRET' 
            : 'default_fallback'),
        secretLength: secret.length
      });
      return secret;
    }
  }

  throw new Error('No valid JWT secret found');
};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login Attempt:', { email });

    // Find user by email
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.log('Login Failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Login Failed: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with full, consistent payload
    const secret = getJwtSecret();
    const token = jwt.sign(
      { 
        id: user.id || null,  // Ensure id is always present
        email: user.email,    // Always include email
        role: user.role || 'user',  // Default to 'user' if no role
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60)  // 24 hours expiration
      }, 
      secret, 
      { 
        algorithm: 'HS256'
      }
    );

    console.log('Login Successful:', { 
      userId: user.id, 
      email: user.email, 
      role: user.role,
      tokenParts: token.split('.')
    });

    res.json({ 
      token,
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    console.log('Get Current User Request:', { 
      userId: req.user.id, 
      email: req.user.email 
    });

    const user = await UserRepository.findById(req.user.id);
    if (!user) {
      console.log('Get Current User Failed: User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('Get Current User Successful:', { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    });

    res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

module.exports = router;
