import create from 'zustand'
import jwt_decode from 'jwt-decode'
import authService from '../services/authService'

const useAuthStore = create((set, get) => {
  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);
      
      console.log('Token Decoding Debug:', {
        fullDecodedToken: decoded,
        tokenParts: token.split('.')
      });

      // If exp is not present, assume token is valid
      if (!decoded.exp) {
        console.warn('Token does not have expiration, assuming valid');
        return false;
      }

      const isExpired = decoded.exp * 1000 < Date.now();

      console.log('Token Expiration Check:', {
        token,
        tokenParts: token.split('.'),
        currentTime: Date.now(),
        expirationTime: decoded.exp * 1000,
        isExpired
      });

      return isExpired;
    } catch (error) {
      console.error('Token decoding error:', {
        error: error.message,
        token,
        tokenParts: token.split('.')
      });
      return true;
    }
  };

  // Function to initialize authentication state
  const initializeAuth = async () => {
    const token = localStorage.getItem('token');
    console.log('Initial Authentication Check:', { 
      token,
      tokenParts: token ? token.split('.') : null 
    });

    if (token && !isTokenExpired(token)) {
      try {
        console.log('Attempting to validate token with backend');
        // Validate token with backend
        const currentUser = await authService.getCurrentUser();
        
        console.log('Backend User Validation Successful:', currentUser);

        set({ 
          user: {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role
          }, 
          token, 
          role: currentUser.role, 
          status: 'active',
          isAuthenticated: true 
        });

        return true;
      } catch (error) {
        console.error('Token validation failed:', {
          error: error.message,
          token,
          tokenParts: token.split('.')
        });
        
        // Only remove token if backend validation fails
        localStorage.removeItem('token');
        set({ 
          user: null, 
          token: null, 
          role: null, 
          status: null,
          isAuthenticated: false 
        });

        return false;
      }
    } else if (token) {
      // Token is expired
      console.log('Token is expired, removing from storage', {
        token,
        tokenParts: token.split('.')
      });
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        role: null, 
        status: null,
        isAuthenticated: false 
      });
    }
    return false;
  };

  // Initial auth check when store is created
  const initialAuthCheck = initializeAuth();

  return {
    user: null,
    token: null,
    role: null,
    status: null,
    isAuthenticated: false,
    
    // Backward compatibility method
    setAuth: (authData) => {
      if (authData && authData.token) {
        try {
          const decodedUser = jwt_decode(authData.token);
          
          console.log('SetAuth Token Decoding:', {
            token: authData.token,
            tokenParts: authData.token.split('.'),
            decodedUser
          });

          set({ 
            user: {
              id: decodedUser.id || null,
              email: decodedUser.email,
              role: decodedUser.role || 'user'
            }, 
            token: authData.token, 
            role: decodedUser.role || 'user', 
            status: 'active',
            isAuthenticated: true 
          });

          // Store token in localStorage for persistence
          localStorage.setItem('token', authData.token);
        } catch (error) {
          console.error('Error in setAuth:', {
            error: error.message,
            token: authData.token,
            tokenParts: authData.token.split('.')
          });
          set({
            user: null,
            token: null,
            role: null,
            status: null,
            isAuthenticated: false
          });
        }
      }
    },

    login: async (credentials) => {
      try {
        const authData = await authService.login(credentials);
        
        console.log('Login Response:', {
          token: authData.token,
          tokenParts: authData.token.split('.'),
          user: authData.user
        });

        if (authData && authData.token) {
          const decodedUser = jwt_decode(authData.token);
          
          set({ 
            user: {
              id: decodedUser.id || null,
              email: decodedUser.email,
              role: decodedUser.role || 'user'
            }, 
            token: authData.token, 
            role: decodedUser.role || 'user', 
            status: 'active',
            isAuthenticated: true 
          });

          // Store token in localStorage for persistence
          localStorage.setItem('token', authData.token);
        }
        
        return authData;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    
    logout: () => {
      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        role: null, 
        status: null,
        isAuthenticated: false 
      });
    },

    // Method to manually check and restore authentication
    checkAuth: initializeAuth,

    // Helper method to check if user is authorized
    isAuthorized: (requiredRole = null, requiredStatus = null) => {
      const state = get();
      
      // Check role if specified
      const roleCheck = requiredRole ? state.role === requiredRole : true;
      
      // Check status if specified
      const statusCheck = requiredStatus ? state.status === requiredStatus : true;
      
      return state.isAuthenticated && roleCheck && statusCheck;
    },

    // Debug method to print current user state
    debugUserState: () => {
      const state = get();
      console.log('Current Auth State:', {
        user: state.user,
        role: state.role,
        status: state.status,
        isAuthenticated: state.isAuthenticated,
        token: state.token ? state.token.split('.') : null
      });
      return state;
    }
  };
});

export default useAuthStore;
