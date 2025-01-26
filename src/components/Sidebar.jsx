import {
  Box,
  VStack,
  Link,
  Icon,
  Text,
  Spacer
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { 
  FiHome, 
  FiUsers, 
  FiUser, 
  FiCalendar, 
  FiInbox, 
  FiList,
  FiFolder
} from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'

const Sidebar = () => {
  const { user, debugUserState } = useAuthStore()

  useEffect(() => {
    console.log('Sidebar User Debug:', {
      user: user,
      userRole: user?.role,
      isAdmin: user?.role === 'ADMIN'
    });
    
    // Additional global debug
    debugUserState();
  }, [user]);

  return (
    <Box
      w="240px"
      bg="white"
      borderRightWidth={1}
      py={4}
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      position="fixed"
      top="64px"
      left={0}
      height="calc(100vh - 64px)"
      overflowY="auto"
      zIndex={10}
    >
      <VStack spacing={2} align="stretch" flex="1">
        <Link
          as={RouterLink}
          to="/"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Icon as={FiHome} mr={2} />
          Dashboard
        </Link>

        <Link
          as={RouterLink}
          to="/profile"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Icon as={FiUser} mr={2} />
          Meu Perfil
        </Link>

        <Link
          as={RouterLink}
          to="/scheduling"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Icon as={FiCalendar} mr={2} />
          Agendar Bancada
        </Link>

        <Link
          as={RouterLink}
          to="/user-requests"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Icon as={FiList} mr={2} />
          Meus Agendamentos
        </Link>

        <Link
          as={RouterLink}
          to="/my-projects"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
        >
          <Icon as={FiFolder} mr={2} />
          Meus Projetos
        </Link>
        
        {user?.role === 'ADMIN' && (
          <>
            <Link
              as={RouterLink}
              to="/admin"
              px={4}
              py={2}
              display="flex"
              alignItems="center"
              _hover={{ bg: 'gray.100' }}
            >
              <Icon as={FiUsers} mr={2} />
              Gerenciar Usuários
            </Link>
            <Link
              as={RouterLink}
              to="/admin/requests"
              px={4}
              py={2}
              display="flex"
              alignItems="center"
              _hover={{ bg: 'gray.100' }}
            >
              <Icon as={FiInbox} mr={2} />
              Solicitações
            </Link>
          </>
        )}
        
        <Spacer />
        
        <Text 
          textAlign="center" 
          color="gray.500" 
          fontSize="sm" 
          p={4}
          borderTopWidth={1}
        >
          v1.0.0
        </Text>
      </VStack>
    </Box>
  )
}

export default Sidebar
