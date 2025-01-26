const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/UserRepository');
require('dotenv').config(); // Ensure environment variables are loaded

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

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Middleware - Authorization Header:', { 
    authHeader,
    jwtSecret: getJwtSecret()
  });

  if (!authHeader) {
    console.log('Auth Middleware: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const [, token] = authHeader.split(' ');
  console.log('Auth Middleware - Token:', { 
    token,
    tokenParts: token.split('.') 
  });

  try {
    const secret = getJwtSecret();
    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256']
    });
    console.log('Auth Middleware - Decoded Token:', { 
      id: decoded.id, 
      email: decoded.email,
      role: decoded.role
    });
    
    const user = await UserRepository.findById(decoded.id);
    console.log('Auth Middleware - User Lookup:', { 
      userFound: !!user,
      userId: user?.id 
    });

    if (!user) {
      console.log('Auth Middleware: Invalid token - User not found');
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    if (error.name === 'JsonWebTokenError') {
      console.log('Auth Middleware: Invalid token signature', {
        token,
        secret: getJwtSecret()
      });
    }

    if (error.name === 'TokenExpiredError') {
      console.log('Auth Middleware: Token expired');
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    console.log('Require Role Middleware:', { 
      requiredRoles: roles, 
      userRole: req.user?.role 
    });

    if (!req.user || !roles.includes(req.user.role)) {
      console.log('Require Role Middleware: Access denied');
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

module.exports = authMiddleware;
module.exports.requireRole = requireRole;
