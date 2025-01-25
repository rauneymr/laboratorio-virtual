import React, { useState } from 'react'
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  HStack,
  useToast,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea
} from '@chakra-ui/react'
import apiData from '../api.json'
import useAuthStore from '../store/authStore'

const AdminUsers = () => {
  const toast = useToast()
  const currentUser = useAuthStore(state => state.user)
  const [users, setUsers] = useState(apiData.users)
  const [selectedUser, setSelectedUser] = useState(null)
  const [modalType, setModalType] = useState(null)

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green'
      case 'pending': return 'yellow'
      case 'disabled': return 'red'
      default: return 'gray'
    }
  }

  const handleUserAction = (userId, action, reason = '') => {
    const userToUpdate = users.find(u => u.id === userId)
    
    if (!userToUpdate) {
      toast({
        title: 'Erro',
        description: 'Usuário não encontrado',
        status: 'error',
        duration: 2000
      })
      return
    }

    const updatedUsers = users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: action === 'disable' ? 'disabled' : 
                     action === 'approve' ? 'approved' : 
                     action === 'reject' ? 'disabled' :
                     action === 'enable' ? 'approved' :
                     user.status 
          }
        : user
    )

    setUsers(updatedUsers)

    toast({
      title: 'Ação de Usuário',
      description: 
        action === 'disable' ? `Usuário ${userToUpdate.name} desativado` :
        action === 'approve' ? `Usuário ${userToUpdate.name} aprovado` :
        action === 'reject' ? `Usuário ${userToUpdate.name} rejeitado` :
        action === 'enable' ? `Usuário ${userToUpdate.name} reativado` :
        'Ação realizada',
      status: 
        action === 'disable' ? 'warning' :
        action === 'approve' ? 'success' :
        action === 'reject' ? 'error' :
        action === 'enable' ? 'success' :
        'info',
      duration: 2000
    })

    // Close modal
    setSelectedUser(null)
    setModalType(null)
  }

  const countUserRequests = (userId) => {
    return apiData.requests.filter(
      req => req.userId === userId && 
             (req.type !== 'user_registration' || req.status === 'pendente')
    ).length
  }

  const openModal = (user, type) => {
    setSelectedUser(user)
    setModalType(type)
  }

  const closeModal = () => {
    setSelectedUser(null)
    setModalType(null)
  }

  return (
    <Box>
      <Heading mb={6}>Gerenciamento de Usuários</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple">
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
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      user.role === 'admin' ? 'purple' : 
                      user.role === 'user' ? 'blue' : 
                      'gray'
                    }
                  >
                    {user.role === 'admin' ? 'Administrador' : 
                     user.role === 'user' ? 'Usuário' : 
                     'Não definido'}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(user.status)}>
                    {user.status === 'approved' ? 'Aprovado' :
                     user.status === 'pending' ? 'Pendente' :
                     user.status === 'disabled' ? 'Desativado' :
                     'Não definido'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontWeight="bold">
                    {countUserRequests(user.id)}
                  </Text>
                </Td>
                <Td>
                  <HStack>
                    {user.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          colorScheme="green"
                          onClick={() => handleUserAction(user.id, 'approve')}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          colorScheme="red"
                          onClick={() => openModal(user, 'reject')}
                        >
                          Desativar
                        </Button>
                      </>
                    )}
                    
                    {user.status === 'disabled' && (
                      <Button 
                        size="sm" 
                        colorScheme="green"
                        onClick={() => handleUserAction(user.id, 'enable')}
                      >
                        Ativar
                      </Button>
                    )}
                    
                    {user.status === 'approved' && (
                      <Button 
                        size="sm" 
                        colorScheme="red"
                        onClick={() => handleUserAction(user.id, 'disable')}
                        isDisabled={user.role === 'admin'}
                      >
                        Desativar
                      </Button>
                    )}
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal para rejeição de usuário */}
      <Modal isOpen={selectedUser && modalType === 'reject'} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Desativar Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              Você está prestes a desativar o usuário <strong>{selectedUser?.name}</strong>. 
              Por favor, forneça um motivo para esta ação.
            </Text>
            <Textarea 
              placeholder="Motivo da desativação (opcional)"
              id="reject-reason"
            />
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              onClick={() => {
                const reasonEl = document.getElementById('reject-reason')
                const reason = reasonEl ? reasonEl.value : ''
                handleUserAction(selectedUser.id, 'reject', reason)
                closeModal()
              }}
            >
              Confirmar Desativação
            </Button>
            <Button variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default AdminUsers
