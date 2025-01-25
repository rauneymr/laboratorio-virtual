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
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Register = () => {
  const { register, handleSubmit } = useForm()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = async (data) => {
    try {
      // Chamada de API seria feita aqui
      toast({
        title: 'Conta criada.',
        description: "Criamos sua conta para você.",
        status: 'success',
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
      })
    }
  }

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
      <Box w="full" maxW="md" p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
        <VStack spacing={4}>
          <Heading>Cadastro</Heading>
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>E-mail</FormLabel>
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
              <FormControl>
                <FormLabel>Confirmar Senha</FormLabel>
                <InputGroup>
                  <Input 
                    type={showConfirmPassword ? 'text' : 'password'} 
                    {...register('confirmPassword')} 
                  />
                  <InputRightElement>
                    <IconButton
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      aria-label={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button type="submit" colorScheme="blue" width="full">
                Cadastrar
              </Button>
              <Link as={RouterLink} to="/login" color="blue.500">
                Já tem uma conta? Faça login
              </Link>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Box>
  )
}

export default Register
