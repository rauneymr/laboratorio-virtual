import { Box, Flex } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

const Layout = () => {
  return (
    <Flex 
      minH="100vh" 
      flexDirection="column"
    >
      <Navbar />
      <Flex flex="1">
        <Sidebar />
        <Box 
          flex="1" 
          overflow="auto" 
          mt={{ base: 0, md: 0 }}
        >
          <Box p={4}>
            <Outlet />
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}

export default Layout
