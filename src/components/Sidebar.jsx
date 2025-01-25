import {
  Box,
  VStack,
  Link,
  Icon
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiHome, FiUsers, FiUser, FiCalendar, FiInbox, FiList } from 'react-icons/fi'
import useAuthStore from '../store/authStore'

const Sidebar = () => {
  const user = useAuthStore(state => state.user)

  return (
    <Box
      w="240px"
      bg="white"
      borderRightWidth={1}
      py={4}
      display={{ base: 'none', md: 'block' }}
      position="sticky"
      top={0}
      h="100vh"
    >
      <VStack spacing={2} align="stretch">
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
          Agendamentos
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
          Minhas Solicitações
        </Link>
        
        {user?.role === 'admin' && (
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
      </VStack>
    </Box>
  )
}

export default Sidebar
