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
  Divider,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const setAuth = useAuthStore(state => state.setAuth)
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const testUsers = apiData.users.reduce((acc, user) => {
    acc[user.email] = {
      password: user.password,
      token: user.token,
      role: user.role,
      status: user.status
    }
    return acc
  }, {})

  const onSubmit = async (data) => {
    try {
      const user = testUsers[data.email]
      
      // Check if user exists
      if (!user) {
        throw new Error('Usuário não encontrado')
      }

      // Check password
      if (user.password !== data.password) {
        throw new Error('Credenciais inválidas')
      }

      // Check user status
      switch (user.status) {
        case 'pending':
          throw new Error('Sua conta está pendente de aprovação. Entre em contato com um administrador.')
        case 'disabled':
          throw new Error('Sua conta foi desativada. Entre em contato com um administrador.')
        case 'approved':
          // Proceed with login
          setAuth({
            token: user.token,
            role: user.role,
            status: user.status
          })
          navigate('/')
          break
        default:
          throw new Error('Status de usuário inválido')
      }
    } catch (error) {
      toast({
        title: 'Erro de Login',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true
      })
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg" m={4}>
        <VStack spacing={4}>
          <Heading size="lg" mb={2}>Login</Heading>
          
          <Alert status="info" borderRadius="md" mb={4}>
            <AlertIcon />
            <Text fontSize="sm">
              Novos usuários precisam de aprovação de um administrador para acessar o sistema.
            </Text>
          </Alert>

          <Box bg="gray.50" p={4} borderRadius="md" w="full">
            <Text fontWeight="bold" mb={2}>Credenciais de Teste:</Text>
            
            <Text color="gray.700" fontSize="sm">Usuário Admin:</Text>
            <Text color="gray.600" fontSize="sm">Email: admin@test.com</Text>
            <Text color="gray.600" fontSize="sm" mb={2}>Senha: admin123</Text>
            
            <Divider my={2} />
            
            <Text color="gray.700" fontSize="sm">Usuário Padrão:</Text>
            <Text color="gray.600" fontSize="sm">Email: user@test.com</Text>
            <Text color="gray.600" fontSize="sm">Senha: user123</Text>
          </Box>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email')} />
              </FormControl>
              <FormControl>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input 
                    type={showPassword ? 'text' : 'password'} 
                    {...register('password')} 
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => setShowPassword(!showPassword)}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Entrar
              </Button>
              <Link as={RouterLink} to="/register" color="blue.500">
                Não tem uma conta? Cadastre-se
              </Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
