import { Box } from '@chakra-ui/react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import ProjectConfig from './pages/ProjectConfig'
import ProjectMonitoring from './pages/ProjectMonitoring'
import Profile from './pages/Profile'
import Scheduling from './pages/Scheduling'
import AdminRequests from './pages/AdminRequests'
import AdminWorkbenches from './pages/AdminWorkbenches'
import UserRequests from './pages/UserRequests'

function App() {
  return (
    <Box minH="100vh">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/scheduling" element={<Scheduling />} />
            <Route path="/user-requests" element={<UserRequests />} />
            <Route path="/project/:id/config" element={<ProjectConfig />} />
            <Route path="/project/:id/monitor" element={<ProjectMonitoring />} />
          </Route>
          
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/requests" element={<AdminRequests />} />
            <Route path="/admin/workbenches" element={<AdminWorkbenches />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  )
}

export default App
