import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Link
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'

const Register = () => {
  const { register, handleSubmit } = useForm()
  const toast = useToast()

  const onSubmit = async (data) => {
    try {
      // API call would go here
      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
      })
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading>Register</Heading>
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
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input type="password" {...register('confirmPassword')} />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Register
              </Button>
              <Link as={RouterLink} to="/login" color="blue.500">
                Already have an account? Login
              </Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  )
}

export default Register
