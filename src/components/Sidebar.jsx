import {
  Box,
  VStack,
  Link,
  Icon,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
  Text
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FiHome, FiUsers, FiUser, FiCalendar, FiInbox, FiMenu, FiList } from 'react-icons/fi'
import useAuthStore from '../store/authStore'

const MenuItems = () => {
  const user = useAuthStore(state => state.user)

  return (
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
            Admin Panel
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
  )
}

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      {/* Menu Hamburguer para Mobile */}
      <IconButton
        icon={<FiMenu />}
        onClick={onOpen}
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
        aria-label="Open menu"
      />

      {/* Drawer para Mobile */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
          <DrawerBody>
            <MenuItems />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Menu Desktop */}
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
        <MenuItems />
      </Box>
    </>
  )
}

export default Sidebar
