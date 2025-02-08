import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Loading from './Loading'

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [authError, setAuthError] = useState(null)
  const authStore = useAuthStore()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        console.log('Checking admin authorization...')
        
        // Check if user is authorized as admin
        const authorized = authStore.isAuthorized('ADMIN', 'APPROVED')
        
        console.log('Admin Authorization Result:', authorized)
        
        setIsAuthorized(authorized)
        setIsLoading(false)
      } catch (error) {
        console.error('Admin Route Authorization Error:', error)
        
        // Set specific error message
        setAuthError(error.message)
        setIsAuthorized(false)
        setIsLoading(false)
      }
    }

    checkAuthorization()
  }, [authStore])

  // Show loading while checking authorization
  if (isLoading) {
    console.log('Admin Route: Loading...')
    return <Loading />
  }

  // Handle unauthorized access
  if (!isAuthorized) {
    console.warn('Admin Route: Not Authorized')
    return <Navigate to="/login" replace />
  }

  // If children are provided, render children
  if (children) {
    console.log('Admin Route: Rendering Children')
    return children
  }

  // If no children, render child routes
  console.log('Admin Route: Rendering Outlet')
  return <Outlet />
  
}

export default AdminRoute
