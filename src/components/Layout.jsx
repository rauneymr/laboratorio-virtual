import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <Flex 
      minH="100vh" 
      flexDirection="column"
      pt={{ base: '56px', md: '64px' }}
    >
      <Navbar />
      <Flex flex="1" position="relative">
        <Sidebar />
        <Box 
          flex="1" 
          overflowY="auto"
          ml={{ base: 0, md: '240px' }}
          p={4}
        >
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  )
}

export default Layout
