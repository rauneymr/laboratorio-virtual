import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Link,
  Text,
  Divider
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()
  const toast = useToast()

  const testUsers = {
    'admin@test.com': {
      password: 'admin123',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6ImFkbWluIn0.jkQOuGZZmqmqwxKxPKz5jVGjMRA8uTaFXKx4H5DXRMA'
    },
    'user@test.com': {
      password: 'user123',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAdGVzdC5jb20iLCJyb2xlIjoidXNlciJ9.Uu5P7vYGWWUJY9IhBXfRqXYbHZgWE6YQqDE2bPPz2MY'
    }
  }

  const onSubmit = async (data) => {
    try {
      const user = testUsers[data.email]
      if (user && user.password === data.password) {
        setAuth(user.token)
        navigate('/')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000
      })
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading size="lg" mb={2}>Login</Heading>
          
          <Box bg="gray.50" p={4} borderRadius="md" w="full">
            <Text fontWeight="bold" mb={2}>Test Credentials:</Text>
            
            <Text color="gray.700" fontSize="sm">Admin User:</Text>
            <Text color="gray.600" fontSize="sm">Email: admin@test.com</Text>
            <Text color="gray.600" fontSize="sm" mb={2}>Password: admin123</Text>
            
            <Divider my={2} />
            
            <Text color="gray.700" fontSize="sm">Standard User:</Text>
            <Text color="gray.600" fontSize="sm">Email: user@test.com</Text>
            <Text color="gray.600" fontSize="sm">Password: user123</Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email')} />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...register('password')} />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Login
              </Button>
              <Link as={RouterLink} to="/register" color="blue.500">
                Don't have an account? Register
              </Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
