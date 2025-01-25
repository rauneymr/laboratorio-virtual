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
  Textarea,
  Stack
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
                  <HStack spacing={2}>
                    {user.status === 'pending' && (
                      <>
                        <Button 
                          size="sm"
                          colorScheme="green"
                          onClick={() => openModal(user, 'approve')}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          size="sm"
                          colorScheme="red"
                          onClick={() => openModal(user, 'reject')}
                        >
                          Rejeitar
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

      {/* Modal para aprovar ou rejeitar usuário */}
      <Modal isOpen={selectedUser && (modalType === 'approve' || modalType === 'reject')} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalType === 'approve' ? 'Aprovar Usuário' : 'Rejeitar Usuário'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Text>
                Você está prestes a {modalType === 'approve' ? 'aprovar' : 'rejeitar'} o usuário <strong>{selectedUser?.name}</strong>. 
              </Text>
              
              {modalType === 'reject' && (
                <Textarea 
                  placeholder="Motivo da rejeição (opcional)"
                  id="reject-reason"
                />
              )}
              
              <Text fontWeight="bold" color={modalType === 'approve' ? 'green.500' : 'red.500'}>
                {modalType === 'approve' 
                  ? 'Ao aprovar, o usuário terá acesso total ao sistema.' 
                  : 'Ao rejeitar, o usuário será desativado e não poderá acessar o sistema.'}
              </Text>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button 
              size="sm"
              colorScheme={modalType === 'approve' ? 'green' : 'red'}
              mr={3} 
              onClick={() => {
                const reasonEl = document.getElementById('reject-reason')
                const reason = reasonEl ? reasonEl.value : ''
                handleUserAction(
                  selectedUser.id, 
                  modalType === 'approve' ? 'approve' : 'reject', 
                  reason
                )
                closeModal()
              }}
            >
              {modalType === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
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
    </Box>
  )
}

export default AdminUsers
