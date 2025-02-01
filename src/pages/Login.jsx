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
  IconButton,
  useColorModeValue
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import useAuthStore from '../store/authStore'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const login = useAuthStore(state => state.login)
  const navigate = useNavigate()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data) => {
    try {

      // Use actual login method from authStore
      const authResult = await login({
        email: data.email,
        password: data.password
      });



      // Navigate to home page on successful login
      navigate('/');

      // Optional: Show success toast
      toast({
        title: 'Login Bem-sucedido',
        description: 'Você foi autenticado com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true
      });

    } catch (error) {
      console.error('Login Error:', error);

      // Handle different types of login errors
      const errorMessage = error.response?.data?.error || 
                           error.message || 
                           'Erro de login desconhecido';

      toast({
        title: 'Erro de Login',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true
      });
    }
  }

  const boxBg = useColorModeValue('white', 'gray.800')
  const boxBorder = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.800', 'gray.200')
  const textPrimaryColor = useColorModeValue('gray.700', 'gray.300')
  const textSecondaryColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box 
        w="full" 
        maxW="md" 
        p={8} 
        borderWidth={1} 
        borderRadius={8} 
        boxShadow="lg" 
        m={4}
        bg={boxBg}
        borderColor={boxBorder}
      >
        <VStack spacing={4}>
          <Heading size="lg" mb={2} color={headingColor}>Login</Heading>
          
          <Alert status="info" borderRadius="md" mb={4}>
            <AlertIcon />
            <Text fontSize="sm" color={textSecondaryColor}>
              Novos usuários precisam de aprovação de um administrador para acessar o sistema.
            </Text>
          </Alert>

          <Box 
            p={4} 
            borderRadius="md" 
            w="full" 
            bg={useColorModeValue('gray.50', 'gray.700')}
          >
            <Text fontWeight="bold" mb={2} color={textPrimaryColor}>Credenciais de Teste:</Text>
            
            <Text color={textPrimaryColor} fontSize="sm">Usuário Admin:</Text>
            <Text color={textSecondaryColor} fontSize="sm">Email: admin@test.com</Text>
            <Text color={textSecondaryColor} fontSize="sm" mb={2}>Senha: admin123</Text>
            
            <Divider my={2} borderColor={useColorModeValue('gray.300', 'gray.600')} />
            
            <Text color={textPrimaryColor} fontSize="sm">Usuário Padrão:</Text>
            <Text color={textSecondaryColor} fontSize="sm">Email: user@test.com</Text>
            <Text color={textSecondaryColor} fontSize="sm">Senha: user123</Text>
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
