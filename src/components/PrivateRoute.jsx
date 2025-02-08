import { Navigate, Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import Loading from './Loading'

const PrivateRoute = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState(null)
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authResult = await checkAuth()
        setIsAuthenticated(authResult)
      } catch (error) {
        console.error('Auth verification error:', error)
        setIsAuthenticated(false)
        setAuthError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    verifyAuth()
  }, [checkAuth])

  if (isLoading) {
    return <Loading />
  }

  if (authError) {
    return <div>Error: {authError}</div>
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
