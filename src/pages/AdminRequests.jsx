import React, { useState, useMemo, useEffect } from 'react'
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
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
  VStack,
  Alert,
  AlertIcon,
  Text,
  Flex
} from '@chakra-ui/react'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'
import NameSearchFilter from '../components/NameSearchFilter'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'

const AdminRequests = () => {
  const userAuth = useAuthStore(state => state.user)
  const toast = useToast()
  const [currentUser, setCurrentUser] = useState(null)
  const [scheduleRequests, setScheduleRequests] = useState([])
  const [registrationRequests, setRegistrationRequests] = useState([])
  const [error, setError] = useState(null)
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    try {
      // Find the current admin user
      let foundUser = null;
      if (typeof userAuth === 'string') {
        foundUser = apiData.users.find(u => u.token === userAuth)
      } else if (userAuth && userAuth.email) {
        foundUser = apiData.users.find(u => u.email === userAuth.email)
      } else if (userAuth && userAuth.token) {
        foundUser = apiData.users.find(u => u.token === userAuth.token)
      }

      // Validate admin role
      if (!foundUser || foundUser.role !== 'admin') {
        setError('Acesso não autorizado. Somente administradores podem ver esta página.')
        return
      }

      setCurrentUser(foundUser)

      // Process schedule requests
      const processedScheduleRequests = apiData.requests
        .filter(request => 
          request.status === 'pendente' && 
          request.type !== 'user_registration' &&
          request.workbenchId
        )
        .map(request => {
          // Find user details
          const user = apiData.users.find(u => u.id === request.userId)
          
          // Find workbench details
          const workbench = apiData.workbenches.find(wb => wb.id === request.workbenchId)

          return {
            ...request,
            userName: user ? user.name : 'Usuário não encontrado',
            workbenchName: workbench ? workbench.name : 'Bancada não encontrada'
          }
        })

      // Process user registration requests
      const processedRegistrationRequests = apiData.requests
        .filter(request => 
          request.status === 'pendente' && 
          request.type === 'user_registration'
        )
        .map(request => {
          // Find user details
          const user = apiData.users.find(u => u.id === request.userId)

          return {
            ...request,
            userName: user ? user.name : 'Usuário não encontrado',
            userEmail: user ? user.email : 'Email não encontrado'
          }
        })

      setScheduleRequests(processedScheduleRequests)
      setRegistrationRequests(processedRegistrationRequests)
    } catch (err) {
      console.error('Error processing requests:', err)
      setError('Erro ao carregar solicitações')
    }
  }, [userAuth])

  const filteredScheduleRequests = useMemo(() => {
    return scheduleRequests.filter(request => 
      request.userName.toLowerCase().includes(searchName.toLowerCase())
    )
  }, [scheduleRequests, searchName])

  const filteredRegistrationRequests = useMemo(() => {
    return registrationRequests.filter(request => 
      request.userName.toLowerCase().includes(searchName.toLowerCase())
    )
  }, [registrationRequests, searchName])

  const handleApprove = (requestId, type) => {
    try {
      let requestToUpdate, updatedRequests;
      
      if (type === 'schedule') {
        requestToUpdate = scheduleRequests.find(req => req.id === requestId)
        updatedRequests = scheduleRequests.map(req => 
          req.id === requestId ? { ...req, status: 'aprovado' } : req
        )
        setScheduleRequests(updatedRequests)
      } else if (type === 'registration') {
        requestToUpdate = registrationRequests.find(req => req.id === requestId)
        updatedRequests = registrationRequests.map(req => 
          req.id === requestId ? { ...req, status: 'aprovado' } : req
        )
        
        // Update user role if registration is approved
        const userToUpdate = apiData.users.find(u => u.id === requestToUpdate.userId)
        if (userToUpdate) {
          userToUpdate.role = 'user'
        }

        setRegistrationRequests(updatedRequests)
      }

      toast({
        title: 'Solicitação Aprovada',
        description: `A solicitação de ${type === 'schedule' ? 'agendamento' : 'cadastro'} foi aprovada.`,
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error approving request:', err)
      toast({
        title: 'Erro',
        description: 'Não foi possível aprovar a solicitação.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  const handleReject = (requestId, type) => {
    try {
      let updatedRequests;
      
      if (type === 'schedule') {
        updatedRequests = scheduleRequests.map(req => 
          req.id === requestId ? { ...req, status: 'recusado' } : req
        )
        setScheduleRequests(updatedRequests)
      } else if (type === 'registration') {
        updatedRequests = registrationRequests.map(req => 
          req.id === requestId ? { ...req, status: 'recusado' } : req
        )
        setRegistrationRequests(updatedRequests)
      }

      toast({
        title: 'Solicitação Rejeitada',
        description: `A solicitação de ${type === 'schedule' ? 'agendamento' : 'cadastro'} foi rejeitada.`,
        status: 'warning',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error rejecting request:', err)
      toast({
        title: 'Erro',
        description: 'Não foi possível rejeitar a solicitação.',
        status: 'error',
        duration: 2000,
        isClosable: true,
      })
    }
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box p={2}>
      <Heading mb={6}>Solicitações</Heading>
      
      <Flex mb={6}>
        <NameSearchFilter 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Buscar por nome"
        />
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Agendamentos</Tab>
          <Tab>Cadastros</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            {filteredScheduleRequests.length === 0 ? (
              <Box textAlign="center" py={10}>
                Não há solicitações de agendamento pendentes
              </Box>
            ) : (
              <Box>
                <Table 
                  variant="simple" 
                  display={{ base: 'none', md: 'table' }}
                >
                  <Thead>
                    <Tr>
                      <Th>Solicitante</Th>
                      <Th>Bancada</Th>
                      <Th>Data</Th>
                      <Th>Horário</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredScheduleRequests.map((request) => (
                      <Tr key={request.id}>
                        <Td>{request.userName}</Td>
                        <Td>{request.workbenchName}</Td>
                        <Td>{request.date}</Td>
                        <Td>{request.time || 'Não definido'}</Td>
                        <Td>
                          <Badge 
                            colorScheme={
                              request.status === 'pendente' ? 'yellow' : 
                              request.status === 'aprovado' ? 'green' : 
                              'red'
                            }
                            variant="solid"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="green"
                              leftIcon={<CheckIcon />}
                              onClick={() => handleApprove(request.id, 'schedule')}
                              isDisabled={request.status !== 'pendente'}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              leftIcon={<CloseIcon />}
                              onClick={() => handleReject(request.id, 'schedule')}
                              isDisabled={request.status !== 'pendente'}
                            >
                              Rejeitar
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <VStack 
                  spacing={4} 
                  width="100%" 
                  display={{ base: 'flex', md: 'none' }}
                >
                  {filteredScheduleRequests.map((request) => (
                    <Box 
                      key={request.id} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      p={4} 
                      width="100%"
                      
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">{request.userName}</Text>
                          <Badge 
                            colorScheme={
                              request.status === 'pendente' ? 'yellow' : 
                              request.status === 'aprovado' ? 'green' : 
                              'red'
                            }
                            variant="solid"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </HStack>
                        <VStack align="stretch" spacing={1}>
                          <Text color="gray.600">Bancada: {request.workbenchName}</Text>
                          <Text color="gray.600">Data: {request.date}</Text>
                          <Text color="gray.600">Horário: {request.time || 'Não definido'}</Text>
                        </VStack>
                        <HStack justifyContent="space-between">
                          <Button
                            size="sm"
                            colorScheme="green"
                            leftIcon={<CheckIcon />}
                            onClick={() => handleApprove(request.id, 'schedule')}
                            isDisabled={request.status !== 'pendente'}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            leftIcon={<CloseIcon />}
                            onClick={() => handleReject(request.id, 'schedule')}
                            isDisabled={request.status !== 'pendente'}
                          >
                            Rejeitar
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </TabPanel>

          <TabPanel px={0}>
            {filteredRegistrationRequests.length === 0 ? (
              <Box textAlign="center" py={10}>
                Não há solicitações de cadastro pendentes
              </Box>
            ) : (
              <Box>
                <Table 
                  variant="simple" 
                  display={{ base: 'none', md: 'table' }}
                >
                  <Thead>
                    <Tr>
                      <Th>Solicitante</Th>
                      <Th>Email</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRegistrationRequests.map((request) => (
                      <Tr key={request.id}>
                        <Td>{request.userName}</Td>
                        <Td>{request.userEmail}</Td>
                        <Td>
                          <Badge 
                            colorScheme={
                              request.status === 'pendente' ? 'yellow' : 
                              request.status === 'aprovado' ? 'green' : 
                              'red'
                            }
                            variant="solid"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="green"
                              leftIcon={<CheckIcon />}
                              onClick={() => handleApprove(request.id, 'registration')}
                              isDisabled={request.status !== 'pendente'}
                            >
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              leftIcon={<CloseIcon />}
                              onClick={() => handleReject(request.id, 'registration')}
                              isDisabled={request.status !== 'pendente'}
                            >
                              Rejeitar
                            </Button>
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <VStack 
                  spacing={4} 
                  width="100%" 
                  display={{ base: 'flex', md: 'none' }}
                >
                  {filteredRegistrationRequests.map((request) => (
                    <Box 
                      key={request.id} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      p={4} 
                      width="100%"
                      variant="solid"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">{request.userName}</Text>
                          <Badge 
                            colorScheme={
                              request.status === 'pendente' ? 'yellow' : 
                              request.status === 'aprovado' ? 'green' : 
                              'red'
                            }
                            variant="solid"
                          >
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </Badge>
                        </HStack>
                        <VStack align="stretch" spacing={1}>
                          <Text color="gray.600">Email: {request.userEmail}</Text>
                        </VStack>
                        <HStack justifyContent="space-between">
                          <Button
                            size="sm"
                            colorScheme="green"
                            leftIcon={<CheckIcon />}
                            onClick={() => handleApprove(request.id, 'registration')}
                            isDisabled={request.status !== 'pendente'}
                          >
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            colorScheme="red"
                            leftIcon={<CloseIcon />}
                            onClick={() => handleReject(request.id, 'registration')}
                            isDisabled={request.status !== 'pendente'}
                          >
                            Rejeitar
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default AdminRequests
