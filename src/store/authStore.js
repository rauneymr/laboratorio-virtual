import create from 'zustand'
import jwt_decode from 'jwt-decode'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null,
  status: null,
  isAuthenticated: false,
  
  setAuth: (authData) => {
    if (authData && authData.token) {
      const decodedUser = jwt_decode(authData.token)
      set({ 
        user: decodedUser, 
        token: authData.token, 
        role: authData.role, 
        status: authData.status,
        isAuthenticated: true 
      })
    }
  },
  
  logout: () => {
    set({ 
      user: null, 
      token: null, 
      role: null, 
      status: null,
      isAuthenticated: false 
    })
  },

  // Helper method to check if user is authorized
  isAuthorized: (requiredRole = null, requiredStatus = null) => {
    const state = useAuthStore.getState()
    
    // Check role if specified
    const roleCheck = requiredRole ? state.role === requiredRole : true
    
    // Check status if specified
    const statusCheck = requiredStatus ? state.status === requiredStatus : true
    
    return state.isAuthenticated && roleCheck && statusCheck
  }
}))

export default useAuthStore
