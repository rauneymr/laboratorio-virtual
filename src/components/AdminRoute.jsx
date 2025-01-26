import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'

const AdminRoute = () => {
  const { user, isAuthenticated, debugUserState } = useAuthStore()
  
  useEffect(() => {
    console.log('AdminRoute Debug:', {
      user,
      isAuthenticated,
      userRole: user?.role,
      isAdmin: user?.role === 'ADMIN'
    });
    
    // Additional global debug
    debugUserState();
  }, [user, isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.role !== 'ADMIN') return <Navigate to="/" />
  
  return <Outlet />
}

export default AdminRoute
