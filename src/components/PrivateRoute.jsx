import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authResult = await checkAuth()
        console.log('Private Route Auth Check:', { authResult })
        setIsAuthenticated(authResult)
      } catch (error) {
        console.error('Auth verification error:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [checkAuth])

  if (isLoading) {
    // Optional: Add a loading spinner or placeholder
    return <div>Carregando...</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
