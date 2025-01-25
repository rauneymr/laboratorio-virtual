import create from 'zustand'
import jwt_decode from 'jwt-decode'

const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  role: null,
  status: null,
  isAuthenticated: false,
  
  setAuth: (authData) => {
    console.log('setAuth called with:', authData)
    
    if (authData && authData.token) {
      try {
        const decodedUser = jwt_decode(authData.token)
        console.log('Decoded User Token:', decodedUser)
        
        // Find the user in api.json (for testing purposes)
        const users = [
          { id: 1, email: 'admin@test.com', role: 'admin' },
          { id: 2, email: 'user@test.com', role: 'user' }
        ]
        const matchedUser = users.find(u => u.email === decodedUser.email)
        
        console.log('Matched User:', matchedUser)
        
        set({ 
          user: {
            ...decodedUser,
            id: matchedUser ? matchedUser.id : null,
            email: decodedUser.email,
            role: matchedUser ? matchedUser.role : decodedUser.role
          }, 
          token: authData.token, 
          role: matchedUser ? matchedUser.role : authData.role, 
          status: authData.status,
          isAuthenticated: true 
        })
      } catch (error) {
        console.error('Error in setAuth:', error)
        set({
          user: null,
          token: null,
          role: null,
          status: null,
          isAuthenticated: false
        })
      }
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
  },

  // Debug method to print current user state
  debugUserState: () => {
    const state = get()
    console.log('Current Auth State:', {
      user: state.user,
      role: state.role,
      status: state.status,
      isAuthenticated: state.isAuthenticated
    })
    return state
  }
}))

export default useAuthStore
