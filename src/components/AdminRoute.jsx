import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Loading from './Loading'

const AdminRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [authError, setAuthError] = useState(null)
  const authStore = useAuthStore()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        // Check if user is authorized as admin
        const isAdmin = authStore.isAuthorized('admin', 'approved')
        
        if (isAdmin) {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Admin Route Authorization Error:', error)
        
        // Set specific error message
        setAuthError(error.message)
        setIsLoading(false)
      }
    }

    checkAuthorization()
  }, [authStore])

  // Show loading while checking authorization
  if (isLoading) {
    return <Loading />
  }

  // Handle authorization errors
  if (authError) {
    return (
      <div>
        <h2>Acesso Não Autorizado</h2>
        <p>{authError}</p>
        <button onClick={() => authStore.logout()}>Fazer Logout</button>
      </div>
    )
  }

  // If authorized, render children
  return children
}

export default AdminRoute
