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

const RequestsTable = ({ requests, onApprove, onReject, type }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Solicitante</Th>
        {type === 'schedule' && (
          <>
            <Th>Bancada</Th>
            <Th>Data</Th>
            <Th>Horário</Th>
          </>
        )}
        {type === 'registration' && (
          <>
            <Th>Email</Th>
          </>
        )}
        <Th>Status</Th>
        <Th>Ações</Th>
      </Tr>
    </Thead>
    <Tbody>
      {requests.map((request) => (
        <Tr key={request.id}>
          <Td>{request.userName}</Td>
          {type === 'schedule' && (
            <>
              <Td>{request.workbenchName}</Td>
              <Td>{request.date}</Td>
              <Td>{request.time || 'Não definido'}</Td>
            </>
          )}
          {type === 'registration' && (
            <Td>{request.userEmail}</Td>
          )}
          <Td>
            <Badge 
              colorScheme={
                request.status === 'pendente' ? 'yellow' : 
                request.status === 'aprovado' ? 'green' : 
                'red'
              }
            >
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
          </Td>
          <Td>
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => onApprove(request.id, type)}
                isDisabled={request.status !== 'pendente'}
              >
                Aprovar
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => onReject(request.id, type)}
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
)

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

  const handleApprove = (id, type) => {
    try {
      let requestToUpdate, updatedRequests;
      
      if (type === 'schedule') {
        requestToUpdate = scheduleRequests.find(req => req.id === id)
        updatedRequests = scheduleRequests.map(req => 
          req.id === id ? { ...req, status: 'aprovado' } : req
        )
        setScheduleRequests(updatedRequests)
      } else if (type === 'registration') {
        requestToUpdate = registrationRequests.find(req => req.id === id)
        updatedRequests = registrationRequests.map(req => 
          req.id === id ? { ...req, status: 'aprovado' } : req
        )
        
        // Update user role if registration is approved
        const userToUpdate = apiData.users.find(u => u.id === requestToUpdate.userId)
        if (userToUpdate) {
          userToUpdate.role = 'user'
        }

        setRegistrationRequests(updatedRequests)
      }

      toast({
        title: 'Solicitação aprovada',
        status: 'success',
        duration: 2000
      })
    } catch (err) {
      console.error('Error approving request:', err)
      toast({
        title: 'Erro ao aprovar solicitação',
        status: 'error',
        duration: 2000
      })
    }
  }

  const handleReject = (id, type) => {
    try {
      let requestToUpdate, updatedRequests;
      
      if (type === 'schedule') {
        requestToUpdate = scheduleRequests.find(req => req.id === id)
        updatedRequests = scheduleRequests.map(req => 
          req.id === id ? { ...req, status: 'recusado' } : req
        )
        setScheduleRequests(updatedRequests)
      } else if (type === 'registration') {
        requestToUpdate = registrationRequests.find(req => req.id === id)
        updatedRequests = registrationRequests.map(req => 
          req.id === id ? { ...req, status: 'recusado' } : req
        )
        setRegistrationRequests(updatedRequests)
      }

      toast({
        title: 'Solicitação rejeitada',
        status: 'error',
        duration: 2000
      })
    } catch (err) {
      console.error('Error rejecting request:', err)
      toast({
        title: 'Erro ao rejeitar solicitação',
        status: 'error',
        duration: 2000
      })
    }
  }

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

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box>
      <Heading mb={6}>Solicitações Pendentes</Heading>
      <Flex mb={6}>
        <NameSearchFilter 
          value={searchName} 
          onChange={(e) => setSearchName(e.target.value)}
        />
      </Flex>

      <Tabs>
        <TabList>
          <Tab>Agendamentos</Tab>
          <Tab>Cadastros</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {filteredScheduleRequests.length === 0 ? (
              <Box textAlign="center" py={10}>
                Não há solicitações de agendamento pendentes
              </Box>
            ) : (
              <RequestsTable
                requests={filteredScheduleRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                type="schedule"
              />
            )}
          </TabPanel>
          <TabPanel>
            {filteredRegistrationRequests.length === 0 ? (
              <Box textAlign="center" py={10}>
                Não há solicitações de cadastro pendentes
              </Box>
            ) : (
              <RequestsTable
                requests={filteredRegistrationRequests}
                onApprove={handleApprove}
                onReject={handleReject}
                type="registration"
              />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default AdminRequests
