import { Box, Flex, Button, Text, IconButton, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useDisclosure, VStack, Link, Icon, useColorMode } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiHome, FiUsers, FiUser, FiCalendar, FiInbox, FiList, FiFolder, FiMoon, FiSun } from 'react-icons/fi'
import useAuthStore from '../store/authStore'
import { useEffect } from 'react'

export const MenuItems = ({ onClose }) => {
  const { user, debugUserState } = useAuthStore()
  const navigate = useNavigate()
  const { colorMode } = useColorMode()

  useEffect(() => {
    // Additional global debug
    debugUserState();
  }, [user]);

  const handleMenuItemClick = (path) => {
    navigate(path)
    if (onClose) {
      onClose()
    }
  }

  const linkProps = {
    px: 4,
    py: 2,
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'md',
    _hover: { 
      bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200',
      color: colorMode === 'light' ? 'gray.900' : 'white'
    },
    color: colorMode === 'light' ? 'gray.800' : 'whiteAlpha.900'
  }

  return (
    <VStack spacing={2} align="stretch" height="100%" justifyContent="space-between">
      <VStack spacing={2} align="stretch">
        <Link
          as={RouterLink}
          to="/"
          {...linkProps}
          onClick={() => handleMenuItemClick('/')}
        >
          <Icon as={FiHome} mr={2} />
          Dashboard
        </Link>

        <Link
          as={RouterLink}
          to="/profile"
          {...linkProps}
          onClick={() => handleMenuItemClick('/profile')}
        >
          <Icon as={FiUser} mr={2} />
          Meu Perfil
        </Link>

        <Link
          as={RouterLink}
          to="/scheduling"
          {...linkProps}
          onClick={() => handleMenuItemClick('/scheduling')}
        >
          <Icon as={FiCalendar} mr={2} />
          Agendar Bancada
        </Link>

        <Link
          as={RouterLink}
          to="/user-requests"
          {...linkProps}
          onClick={() => handleMenuItemClick('/user-requests')}
        >
          <Icon as={FiList} mr={2} />
          Meus Agendamentos
        </Link>

        <Link
          as={RouterLink}
          to="/my-projects"
          {...linkProps}
          onClick={() => handleMenuItemClick('/my-projects')}
        >
          <Icon as={FiFolder} mr={2} />
          Meus Projetos
        </Link>
        
        {user?.role === 'ADMIN' && (
          <>
            <Link
              as={RouterLink}
              to="/admin"
              {...linkProps}
              onClick={() => handleMenuItemClick('/admin')}
            >
              <Icon as={FiUsers} mr={2} />
              Gerenciar Usuários
            </Link>
            <Link
              as={RouterLink}
              to="/admin/requests"
              {...linkProps}
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
  const { colorMode, toggleColorMode } = useColorMode()

  const handleLogout = () => {
    console.log('[Navbar] Attempting to logout')
    console.log('[Navbar] Current user:', user)
    
    try {
      logout()
      console.log('[Navbar] Logout successful, navigating to login')
      navigate('/login')
    } catch (error) {
      console.error('[Navbar] Logout error:', error)
      // Fallback navigation
      window.location.href = '/login'
    }
  }

  return (
    <>
      <Flex
        px={4}
        py={4}
        borderBottomWidth={1}
        borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
        justify="space-between"
        align="center"
        position="fixed"
        top={0}
        left={0}
        right={0}
        height="64px"
        zIndex={20}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        color={colorMode === 'light' ? 'gray.800' : 'white'}
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
          color={colorMode === 'light' ? 'gray.800' : 'white'}
          _hover={{ 
            bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200' 
          }}
        />

        <Text 
          fontSize="lg" 
          fontWeight="bold" 
          ml={{ base: '50px', md: 0 }}
          color={colorMode === 'light' ? 'gray.800' : 'white'}
        >
          Laboratório Remoto
        </Text>
        <Flex 
          flexDirection={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'flex-end', md: 'center' }}
          gap={2}
        >
          <Flex 
            display={{ base: 'flex', md: 'none' }} 
            alignItems="center" 
            gap={2}
          >
            <IconButton 
              icon={colorMode === 'light' ? <FiMoon /> : <FiSun />} 
              onClick={toggleColorMode} 
              variant="ghost"
              aria-label="Toggle color mode"
              size="sm"
              color={colorMode === 'light' ? 'gray.800' : 'white'}
              _hover={{ 
                bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200' 
              }}
            />

            {user && (
              <Button 
                size="sm" 
                onClick={handleLogout}
                variant="outline"
                borderColor={colorMode === 'light' ? 'red.500' : 'whiteAlpha.400'}
                color={colorMode === 'light' ? 'red.500' : 'white'}
                _hover={{ 
                  bg: colorMode === 'light' ? 'red.50' : 'whiteAlpha.200' 
                }}
              >
                Sair
              </Button>
            )}
          </Flex>

          <IconButton 
            icon={colorMode === 'light' ? <FiMoon /> : <FiSun />} 
            onClick={toggleColorMode} 
            variant="ghost"
            aria-label="Toggle color mode"
            size="sm"
            display={{ base: 'none', md: 'flex' }}
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ 
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200' 
            }}
          />

          <Button 
            size="sm" 
            onClick={handleLogout}
            variant="outline"
            display={{ base: 'none', md: 'flex' }}
            borderColor={colorMode === 'light' ? 'red.500' : 'whiteAlpha.400'}
            color={colorMode === 'light' ? 'red.500' : 'white'}
            _hover={{ 
              bg: colorMode === 'light' ? 'red.50' : 'whiteAlpha.200' 
            }}
          >
            Sair
          </Button>
        </Flex>
      </Flex>

      {/* Drawer for Mobile Menu */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent 
          bg={colorMode === 'light' ? 'white' : 'gray.800'}
          color={colorMode === 'light' ? 'gray.800' : 'white'}
        >
          <DrawerCloseButton 
            color={colorMode === 'light' ? 'gray.800' : 'white'}
            _hover={{ 
              bg: colorMode === 'light' ? 'gray.100' : 'whiteAlpha.200' 
            }}
          />
          <DrawerHeader 
            borderBottomWidth="1px"
            borderBottomColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          >
            Menu
          </DrawerHeader>
          <DrawerBody p={0}>
            <MenuItems onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default Navbar
