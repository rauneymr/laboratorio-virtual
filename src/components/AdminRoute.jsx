import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const AdminRoute = () => {
  const user = useAuthStore(state => state.user)
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  
  if (!isAuthenticated) return <Navigate to="/login" />
  if (user?.role !== 'admin') return <Navigate to="/" />
  
  return <Outlet />
}

export default AdminRoute
