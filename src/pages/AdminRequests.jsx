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
import requestService from '../services/requestService'
import NameSearchFilter from '../components/NameSearchFilter'
import { CheckIcon, CloseIcon } from '@chakra-ui/icons'
import { formatDateBR } from '../utils/dateUtils'

const AdminRequests = () => {
  console.log('Rendering AdminRequests')
  const userAuth = useAuthStore(state => state.user)
  const toast = useToast()
  const [currentUser, setCurrentUser] = useState(null)
  const [scheduleRequests, setScheduleRequests] = useState([])
  const [registrationRequests, setRegistrationRequests] = useState([])
  const [error, setError] = useState(null)
  const [searchName, setSearchName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Validate admin role
        if (!userAuth || userAuth.role !== 'ADMIN') {
          setError('Acesso não autorizado. Somente administradores podem ver esta página.')
          return
        }

        setCurrentUser(userAuth)
        setLoading(true)

        // Fetch pending requests
        const scheduleRequestsData = await requestService.getPendingRequests('workbench_request')
        const registrationRequestsData = await requestService.getPendingRequests('user_registration')

        setScheduleRequests(scheduleRequestsData)
        setRegistrationRequests(registrationRequestsData)
      } catch (err) {
        console.error('Error processing requests:', err)
        setError('Erro ao carregar solicitações')
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as solicitações',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [userAuth, toast])

  const filteredScheduleRequests = useMemo(() => {
    return scheduleRequests.filter(request => 
      request.user?.name?.toLowerCase().includes(searchName.toLowerCase()) || false
    )
  }, [scheduleRequests, searchName])

  const filteredRegistrationRequests = useMemo(() => {
    console.log('All Registration Requests:', registrationRequests)
    console.log('Search Name:', searchName)
    
    const filtered = registrationRequests.filter(request => {
      console.log('Individual Request:', request)
      
      // Log specific details about each request
      console.log('Request User:', request.user)
      console.log('Request User Email:', request.user?.email)
      
      // If no search name, return all requests
      if (!searchName) return true
      
      // Check if user email contains search name
      return request.user?.email?.toLowerCase().includes(searchName.toLowerCase()) || false
    })
    
    console.log('Filtered Registration Requests:', filtered)
    return filtered
  }, [registrationRequests, searchName])

  const handleApprove = async (requestId, type) => {
    try {
      if (type === 'schedule') {
        const updatedRequest = await requestService.approveRequest(requestId)
        setScheduleRequests(prev => 
          prev.filter(req => req.id !== requestId)
        )
      } else if (type === 'registration') {
        const updatedRequest = await requestService.approveRequest(requestId)
        setRegistrationRequests(prev => 
          prev.filter(req => req.id !== requestId)
        )
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

  const handleReject = async (requestId, type) => {
    try {
      if (type === 'schedule') {
        const updatedRequest = await requestService.rejectRequest(requestId)
        setScheduleRequests(prev => 
          prev.filter(req => req.id !== requestId)
        )
      } else if (type === 'registration') {
        const updatedRequest = await requestService.rejectRequest(requestId)
        setRegistrationRequests(prev => 
          prev.filter(req => req.id !== requestId)
        )
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
      <Heading mb={6}>Solicitações de Administrador</Heading>
      
      <NameSearchFilter 
        placeholder="Buscar solicitação por nome" 
        onSearchChange={setSearchName} 
      />

      <Tabs mt={4}>
        <TabList>
          <Tab>Agendamentos Pendentes</Tab>
          <Tab>Cadastros Pendentes</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {loading ? (
              <Text>Carregando solicitações...</Text>
            ) : filteredScheduleRequests.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                Não há solicitações de agendamento pendentes.
              </Alert>
            ) : (
              <>
                <Table 
                  variant="simple" 
                  display={{ base: 'none', md: 'table' }}
                >
                  <Thead>
                    <Tr>
                      <Th>Usuário</Th>
                      <Th>Bancada</Th>
                      <Th>Data Inicial</Th>
                      <Th>Data Final</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredScheduleRequests.map(request => (
                      <Tr key={request.id}>
                        <Td>{request.user.name}</Td>
                        <Td>{request.workbench.name}</Td>
                        <Td>{formatDateBR(request.initialDate)}</Td>
                        <Td>{formatDateBR(request.finalDate)}</Td>
                        <Td>
                          <HStack>
                            <Button 
                              colorScheme="green" 
                              size="sm" 
                              leftIcon={<CheckIcon />}
                              onClick={() => handleApprove(request.id, 'schedule')}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              colorScheme="red" 
                              size="sm" 
                              leftIcon={<CloseIcon />}
                              onClick={() => handleReject(request.id, 'schedule')}
                            >
                              Rejeitar
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
                  {filteredScheduleRequests.map(request => (
                    <Box 
                      key={request.id} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      p={4} 
                      width="100%"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">{request.user.name}</Text>
                          <Badge 
                            colorScheme={request.status === 'PENDING' ? 'yellow' : 'green'}
                            variant="solid"
                          >
                            {request.status === 'PENDING' ? 'Pendente' : 'Aprovado'}
                          </Badge>
                        </HStack>
                        <VStack align="stretch" spacing={1}>
                          <Text color="gray.600">Bancada: {request.workbench.name}</Text>
                          <Text color="gray.600">Data Inicial: {formatDateBR(request.initialDate)}</Text>
                          <Text color="gray.600">Data Final: {formatDateBR(request.finalDate)}</Text>
                        </VStack>
                        <HStack justifyContent="space-between">
                          <Button 
                            colorScheme="green" 
                            size="sm" 
                            leftIcon={<CheckIcon />}
                            onClick={() => handleApprove(request.id, 'schedule')}
                          >
                            Aprovar
                          </Button>
                          <Button 
                            colorScheme="red" 
                            size="sm" 
                            leftIcon={<CloseIcon />}
                            onClick={() => handleReject(request.id, 'schedule')}
                          >
                            Rejeitar
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </>
            )}
          </TabPanel>

          <TabPanel>
            {loading ? (
              <Text>Carregando solicitações...</Text>
            ) : filteredRegistrationRequests.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                Não há solicitações de cadastro pendentes.
              </Alert>
            ) : (
              <>
                <Table 
                  variant="simple" 
                  display={{ base: 'none', md: 'table' }}
                >
                  <Thead>
                    <Tr>
                      <Th>E-mail</Th>
                      <Th>Status</Th>
                      <Th>Ações</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRegistrationRequests.map(request => (
                      <Tr key={request.id}>
                        <Td>{request.user.email}</Td>
                        <Td>
                          <Badge 
                            colorScheme={request.status === 'PENDING' ? 'yellow' : 'green'} 
                            variant="solid"
                          >
                            {request.status === 'PENDING' ? 'Pendente' : 'Aprovado'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack>
                            <Button 
                              colorScheme="green" 
                              size="sm" 
                              leftIcon={<CheckIcon />}
                              onClick={() => handleApprove(request.id, 'registration')}
                            >
                              Aprovar
                            </Button>
                            <Button 
                              colorScheme="red" 
                              size="sm" 
                              leftIcon={<CloseIcon />}
                              onClick={() => handleReject(request.id, 'registration')}
                            >
                              Rejeitar
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
                  {filteredRegistrationRequests.map(request => (
                    <Box 
                      key={request.id} 
                      borderWidth="1px" 
                      borderRadius="lg" 
                      p={4} 
                      width="100%"
                    >
                      <VStack align="stretch" spacing={3}>
                        <HStack justifyContent="space-between" alignItems="center">
                          <Text fontWeight="bold">{request.user.email}</Text>
                          <Badge 
                            colorScheme={request.status === 'PENDING' ? 'yellow' : 'green'}
                            variant="solid"
                          >
                            {request.status === 'PENDING' ? 'Pendente' : 'Aprovado'}
                          </Badge>
                        </HStack>
                        <HStack justifyContent="space-between">
                          <Button 
                            colorScheme="green" 
                            size="sm" 
                            leftIcon={<CheckIcon />}
                            onClick={() => handleApprove(request.id, 'registration')}
                          >
                            Aprovar
                          </Button>
                          <Button 
                            colorScheme="red" 
                            size="sm" 
                            leftIcon={<CloseIcon />}
                            onClick={() => handleReject(request.id, 'registration')}
                          >
                            Rejeitar
                          </Button>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default AdminRequests
