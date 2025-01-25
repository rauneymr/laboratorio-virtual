import create from 'zustand'
import jwt_decode from 'jwt-decode'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  setAuth: (token) => {
    if (token) {
      const user = jwt_decode(token)
      set({ user, token, isAuthenticated: true })
    }
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
  }
}))

export default useAuthStore
