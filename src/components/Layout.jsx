import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box flex="1" overflow="auto">
        <Navbar />
        <Box p={4} mt={{ base: 14, md: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout
