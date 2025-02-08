import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Badge,
  VStack,
  HStack,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Stack
} from '@chakra-ui/react'
import { FaEdit, FaTrash, FaLock, FaUnlock, FaCheck } from 'react-icons/fa'
import useAuthStore from '../store/authStore'
import userService from '../services/userService'
import NameSearchFilter from '../components/NameSearchFilter'
import Loading from '../components/Loading'

const AdminUsers = () => {
  const toast = useToast()
  const currentUser = useAuthStore(state => state.user)
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      console.log('Fetching users in AdminUsers')

      try {
        const response = await userService.getAllUsers()
        setUsers(response)
        setIsLoading(false)
      } catch (error) {
        toast({
          title: 'Erro',
          description: 'Falha ao carregar usuários',
          status: 'error',
          duration: 3000
        })
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    // Add safety checks
    if (!Array.isArray(users)) {
      console.warn('Users is not an array:', users)
      return []
    }

    return users.filter(user => {
      // Check if user is valid
      if (!user || typeof user !== 'object') {
        console.warn('Invalid user object:', user)
        return false
      }

      // Check if name exists and is a string
      if (!user.name || typeof user.name !== 'string') {
        console.warn('User without valid name:', user)
        return false
      }

      // Check if search query exists
      if (!searchQuery) return true

      // Perform case-insensitive search
      return user.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
  }, [users, searchQuery])

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'green'
      case 'PENDING': return 'yellow'
      case 'DISABLED': return 'red'
      default: return 'gray'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'APPROVED': return 'Aprovado'
      case 'PENDING': return 'Pendente'
      case 'DISABLED': return 'Desativado'
      default: return 'Não definido'
    }
  }

  const handleUserAction = async (userId, action, reason = '') => {
    try {
      let response;
      switch (action) {
        case 'DISABLE':
          response = await userService.disableUser(userId, reason)
          break
        case 'ENABLE':
          response = await userService.enableUser(userId)
          break
        case 'APPROVE':
          response = await userService.approveUser(userId)
          break
        case 'REJECT':
          response = await userService.rejectUser(userId, reason)
          break
        default:
          throw new Error('Ação inválida')
      }

      // Update local state
      const updatedUsers = users.map(user => 
        user.id === userId 
          ? { 
              ...user, 
              status: action === 'DISABLE' ? 'DISABLED' : 
                       action === 'ENABLE' ? 'APPROVED' : 
                       action === 'APPROVE' ? 'APPROVED' :
                       action === 'REJECT' ? 'DISABLED' :
                       user.status 
            }
          : user
      )

      setUsers(updatedUsers)

      toast({
        title: 'Ação de Usuário',
        description: 
          action === 'DISABLE' ? `Usuário desativado` :
          action === 'ENABLE' ? `Usuário reativado` :
          action === 'APPROVE' ? `Usuário aprovado` :
          action === 'REJECT' ? `Usuário rejeitado` :
          'Ação realizada',
        status: 
          action === 'DISABLE' ? 'warning' :
          action === 'ENABLE' ? 'success' :
          action === 'APPROVE' ? 'success' :
          action === 'REJECT' ? 'error' :
          'info',
        duration: 2000
      })

      // Close modal
      setSelectedUser(null)
      setModalType(null)
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error || 'Falha ao realizar ação',
        status: 'error',
        duration: 3000
      })
    }
  }

  const countUserRequests = (userId) => {
    // This might need to be updated based on your backend service
    return 0
  }

  const openModal = (user, type) => {
    setSelectedUser(user)
    setModalType(type)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalType(null)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Box p={2}>
      <Heading mb={6}>Gerenciamento de Usuários</Heading>
      
      <Flex mb={6}>
        <NameSearchFilter 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Flex>

      <Box overflowX="auto">
        <Table 
          variant="simple" 
          display={{ base: 'none', md: 'table' }}
        >
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Função</Th>
              <Th>Status</Th>
              <Th>Solicitações Pendentes</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredUsers.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      user.role === 'ADMIN' ? 'purple' : 
                      user.role === 'USER' ? 'blue' : 
                      'gray'
                    }
                    variant="solid"
                  >
                    {user.role === 'ADMIN' ? 'Administrador' : 
                     user.role === 'USER' ? 'Usuário' : 
                     'Não definido'}
                  </Badge>
                </Td>
                <Td>
                  <Badge 
                    colorScheme={getStatusColor(user.status)}
                    variant="solid"
                  >
                    {getStatusLabel(user.status)}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="bold">
                    {countUserRequests(user.id)}
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Button 
                      size="sm" 
                      colorScheme="blue" 
                      leftIcon={<FaEdit />}
                      onClick={() => {
                        setSelectedUser(user)
                        setModalType('edit')
                      }}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="sm" 
                      colorScheme={
                        user.status === 'DISABLED' ? 'green' : 
                        user.status === 'PENDING' ? 'green' : 
                        'red'
                      }
                      leftIcon={
                        user.status === 'DISABLED' ? <FaUnlock /> : 
                        user.status === 'PENDING' ? <FaCheck /> : 
                        <FaLock />
                      }
                      onClick={() => {
                        setSelectedUser(user)
                        setModalType(
                          user.status === 'DISABLED' ? 'REACTIVATE' : 
                          user.status === 'PENDING' ? 'APPROVE' : 
                          'DISABLE'
                        )
                      }}
                    >
                      {
                        user.status === 'DISABLED' ? 'Reativar' : 
                        user.status === 'PENDING' ? 'Aprovar' : 
                        'Desativar'
                      }
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Mobile Card View */}
        <VStack 
          spacing={4} 
          width="100%" 
          display={{ base: 'flex', md: 'none' }}
        >
          {filteredUsers.map((user) => (
            <Box 
              key={user.id} 
              borderWidth="1px" 
              borderRadius="lg" 
              p={4} 
              width="100%"
            >
              <VStack align="stretch" spacing={3}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold">{user.name}</Text>
                  <Badge 
                    colorScheme={getStatusColor(user.status)}
                    variant="solid"
                  >
                    {getStatusLabel(user.status)}
                  </Badge>
                </HStack>
                <VStack align="stretch" spacing={1}>
                  <Text color="gray.600">Email: {user.email}</Text>
                  <HStack>
                    <Text color="gray.600">Função:</Text>
                    <Badge 
                      colorScheme={
                        user.role === 'ADMIN' ? 'purple' : 
                        user.role === 'USER' ? 'blue' : 
                        'gray'
                      }
                      variant="solid"
                    >
                      {user.role === 'ADMIN' ? 'Administrador' : 
                       user.role === 'USER' ? 'Usuário' : 
                       'Não definido'}
                    </Badge>
                  </HStack>
                  <Text color="gray.600">
                    Solicitações Pendentes: {countUserRequests(user.id)}
                  </Text>
                </VStack>
                <HStack justifyContent="space-between">
                  <Button 
                    size="sm" 
                    colorScheme="blue" 
                    leftIcon={<FaEdit />}
                    onClick={() => {
                      setSelectedUser(user)
                      setModalType('edit')
                    }}
                  >
                    Editar
                  </Button>
                  <Button 
                    size="sm" 
                    colorScheme={
                      user.status === 'DISABLED' ? 'green' : 
                      user.status === 'PENDING' ? 'green' : 
                      'red'
                    }
                    leftIcon={
                      user.status === 'DISABLED' ? <FaUnlock /> : 
                      user.status === 'PENDING' ? <FaCheck /> : 
                      <FaLock />
                    }
                    onClick={() => {
                      setSelectedUser(user)
                      setModalType(
                        user.status === 'DISABLED' ? 'REACTIVATE' : 
                        user.status === 'PENDING' ? 'APPROVE' : 
                        'DISABLE'
                      )
                    }}
                  >
                    {
                      user.status === 'DISABLED' ? 'Reativar' : 
                      user.status === 'PENDING' ? 'Aprovar' : 
                      'Desativar'
                    }
                  </Button>
                </HStack>
              </VStack>
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Modal para aprovar ou rejeitar usuário */}
      <Modal isOpen={selectedUser && (modalType === 'APPROVE' || modalType === 'REJECT')} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'APPROVE' ? 'Aprovar Usuário' : 'Rejeitar Usuário'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text>
                Você está prestes a {modalType === 'APPROVE' ? 'aprovar' : 'rejeitar'} o usuário <strong>{selectedUser?.name}</strong>. 
              </Text>
              
              {modalType === 'REJECT' && (
                <Textarea 
                  placeholder="Motivo da rejeição (opcional)"
                  id="reject-reason"
                />
              )}
              
              <Text fontWeight="bold" color={modalType === 'APPROVE' ? 'green.500' : 'red.500'}>
                {modalType === 'APPROVE' 
                  ? 'Ao aprovar, o usuário terá acesso total ao sistema.' 
                  : 'Ao rejeitar, o usuário será desativado e não poderá acessar o sistema.'}
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button 
              size="sm"
              colorScheme={modalType === 'APPROVE' ? 'green' : 'red'}
              mr={3} 
              onClick={() => {
                const reasonEl = document.getElementById('reject-reason')
                const reason = reasonEl ? reasonEl.value : ''
                handleUserAction(
                  selectedUser.id, 
                  modalType === 'APPROVE' ? 'APPROVE' : 'REJECT', 
                  reason
                )
                closeModal()
              }}
            >
              {modalType === 'APPROVE' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={closeModal}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para desativar usuário */}
      <Modal isOpen={modalType === 'DISABLE'} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Desativar Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea 
              placeholder="Motivo da desativação (opcional)"
              id="disableReason"
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              onClick={() => {
                const reasonEl = document.getElementById('disableReason')
                const reason = reasonEl ? reasonEl.value : ''
                handleUserAction(selectedUser.id, 'DISABLE', reason)
              }}
            >
              Desativar
            </Button>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal para reativar usuário */}
      <Modal isOpen={modalType === 'REACTIVATE'} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reativar Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Tem certeza que deseja reativar este usuário?
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={() => handleUserAction(selectedUser.id, 'ENABLE')}
            >
              Reativar
            </Button>
            <Button variant="ghost" onClick={closeModal}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdminUsers
