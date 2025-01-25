import { Box, Flex, Button, Text, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, VStack, Link, Icon } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiHome, FiUsers, FiUser, FiCalendar, FiInbox, FiList, FiFolder } from 'react-icons/fi'
import useAuthStore from '../store/authStore'

export const MenuItems = ({ onClose }) => {
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()

  const handleMenuItemClick = (path) => {
    navigate(path)
    if (onClose) {
      onClose()
    }
  }

  return (
    <VStack spacing={2} align="stretch" height="100%" justifyContent="space-between">
      <VStack spacing={2} align="stretch">
        <Link
          as={RouterLink}
          to="/"
          px={4}
          py={2}
          display="flex"
          alignItems="center"
          _hover={{ bg: 'gray.100' }}
          onClick={() => handleMenuItemClick('/')}
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
          onClick={() => handleMenuItemClick('/profile')}
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
          onClick={() => handleMenuItemClick('/scheduling')}
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
          onClick={() => handleMenuItemClick('/user-requests')}
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
          onClick={() => handleMenuItemClick('/my-projects')}
        >
          <Icon as={FiFolder} mr={2} />
          Meus Projetos
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
              onClick={() => handleMenuItemClick('/admin')}
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
              onClick={() => handleMenuItemClick('/admin/requests')}
            >
              <Icon as={FiInbox} mr={2} />
              Solicitações
            </Link>
          </>
        )}
      </VStack>

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
  )
}

const Navbar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <Flex
        px={4}
        py={4}
        bg="white"
        borderBottomWidth={1}
        justify="space-between"
        align="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="64px"
        zIndex={20}
      >
        {/* Hamburger Menu for Mobile */}
        <IconButton
          icon={<FiMenu />}
          onClick={onOpen}
          display={{ base: 'flex', md: 'none' }}
          position="absolute"
          left={2}
          top="50%"
          transform="translateY(-50%)"
          zIndex={20}
          aria-label="Open menu"
        />

        <Text fontSize="lg" fontWeight="bold" ml={{ base: '50px', md: 0 }}>
          Laboratório Remoto
        </Text>
        <Flex 
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-end', md: 'center' }}
          gap={2}
        >

          <Button 
            size="sm" 
            onClick={handleLogout}
            alignSelf={{ base: 'flex-end', md: 'center' }}
          >
            Sair
          </Button>
        </Flex>
      </Flex>

      {/* Drawer for Mobile Menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <MenuItems onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Navbar
