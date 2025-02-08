import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const AuthRedirect = ({ children }) => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Use backend method to validate current user
          await useAuthStore.getState().checkAuth();
          // If successful, navigate to home
          navigate('/');
        } catch (error) {
          // If validation fails (e.g., invalid token), remove token
          localStorage.removeItem('token');
        }
      }
    };

    checkAuth();
  }, [token, navigate])

  return children
}

export default AuthRedirect
