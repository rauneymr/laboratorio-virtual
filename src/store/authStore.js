import create from 'zustand'
import jwt_decode from 'jwt-decode'
import authService from '../services/authService'

const useAuthStore = create((set, get) => {
  // Function to check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = jwt_decode(token);


      // If exp is not present, assume token is valid
      if (!decoded.exp) {
        console.warn('Token does not have expiration, assuming valid');
        return false;
      }

      const isExpired = decoded.exp * 1000 < Date.now();


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


    if (token && !isTokenExpired(token)) {
      try {
        // Validate token with backend
        const currentUser = await authService.getCurrentUser();
        

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

        console.log(`[AuthStore] User logged in successfully`)
        console.log(`[AuthStore] Current user state:`, get())

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

        console.log(`[AuthStore] User logged out due to token validation failure`)
        console.log(`[AuthStore] Current user state:`, get())

        return false;
      }
    } else if (token) {
      // Token is expired

      localStorage.removeItem('token');
      set({ 
        user: null, 
        token: null, 
        role: null, 
        status: null,
        isAuthenticated: false 
      });

      console.log(`[AuthStore] User logged out due to token expiration`)
      console.log(`[AuthStore] Current user state:`, get())
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

          console.log(`[AuthStore] User logged in successfully`)
          console.log(`[AuthStore] Current user state:`, get())

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

          console.log(`[AuthStore] User logged out due to setAuth error`)
          console.log(`[AuthStore] Current user state:`, get())
        }
      }
    },

    login: async (credentials) => {
      try {
        console.log(`[AuthStore] Attempting login for email: ${credentials.email}`)
        const authData = await authService.login(credentials);
        

        if (authData && authData.token) {
          console.log(`[AuthStore] Login successful for email: ${credentials.email}`)
          console.log(`[AuthStore] User details:`, authData.user)
          
          set({ 
            user: {
              id: authData.user.id,
              email: authData.user.email,
              role: authData.user.role
            }, 
            token: authData.token, 
            role: authData.user.role, 
            status: 'active',
            isAuthenticated: true 
          });

          console.log(`[AuthStore] Current user state:`, get())

          // Store token in localStorage for persistence
          localStorage.setItem('token', authData.token);
        } else {
          console.warn(`[AuthStore] Login failed for email: ${credentials.email}`)
        }
        
        return authData;
      } catch (error) {
        console.error(`[AuthStore] Login error for email: ${credentials.email}`, error)
        throw error;
      }
    },
    
    logout: () => {
      console.log(`[AuthStore] Logging out user: ${get().user?.email || 'Unknown'}`)
      set({ 
        user: null, 
        token: null, 
        role: null, 
        status: null,
        isAuthenticated: false 
      });
      console.log('[AuthStore] User logged out successfully')
      console.log(`[AuthStore] Current user state:`, get())
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
      const currentUser = get().user
      const isAuthenticated = get().isAuthenticated
      
      console.log('[AuthStore] Debug User State:')
      console.log('Is Authenticated:', isAuthenticated)
      console.log('Current User:', currentUser ? {
        id: currentUser.id,
        email: currentUser.email,
        role: currentUser.role,
        status: currentUser.status
      } : 'No user logged in')
    }
  };
});

export default useAuthStore;
