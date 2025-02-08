import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { useState, useEffect } from 'react'
import Loading from './Loading'

const AdminRoute = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user } = useAuthStore()
  const checkAuth = useAuthStore(state => state.checkAuth)
  
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authResult = await checkAuth()
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
    return <Loading />
  }

  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.role !== 'ADMIN') return <Navigate to="/" />
  
  return <Outlet />
}

export default AdminRoute
