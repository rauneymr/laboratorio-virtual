import { Box, Flex, Button, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Flex
      px={4}
      py={2}
      bg="white"
      borderBottomWidth={1}
      justify="space-between"
      align="center"
    >
      <Text fontSize="lg" fontWeight="bold">
        Remote Lab Control
      </Text>
      <Box>
        <Text display="inline-block" mr={4}>
          {user?.email}
        </Text>
        <Button size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Flex>
  )
}

export default Navbar
