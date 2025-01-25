import React, { useState, useMemo, useEffect } from 'react'
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
  VStack,
  Text,
  Flex,
  Spacer,
  Alert,
  AlertIcon,
  Code
} from '@chakra-ui/react'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'
import NameSearchFilter from '../components/NameSearchFilter'

const UserRequests = () => {
  const userAuth = useAuthStore(state => state.user)
  const [requests, setRequests] = useState([])
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    try {
      console.log('Raw userAuth:', userAuth)

      // More flexible user lookup
      let currentUser = null;

      // Try different methods to find the user
      if (typeof userAuth === 'string') {
        // If it's a token string
        currentUser = apiData.users.find(u => u.token === userAuth)
      } else if (userAuth && userAuth.email) {
        // If it's an object with email
        currentUser = apiData.users.find(u => u.email === userAuth.email)
      } else if (userAuth && userAuth.token) {
        // If it's an object with token
        currentUser = apiData.users.find(u => u.token === userAuth.token)
      }
      
      // Detailed debug information
      const debugData = {
        userAuth: JSON.stringify(userAuth),
        currentUser,
        allUsers: apiData.users,
        allRequests: apiData.requests
      }
      setDebugInfo(debugData)
      
      console.log('Debug Information:', debugData)

      if (!currentUser) {
        setError('Usuário não encontrado')
        return
      }

      // Filter requests for the current user
      const userRequests = apiData.requests
        .filter(request => request.userId === currentUser.id)
        .map(request => {
          // Find the workbench name
          const workbench = apiData.workbenches.find(wb => wb.id === request.workbenchId)
          
          // Find the approver's name
          const approver = request.approvedBy 
            ? apiData.users.find(u => u.id === request.approvedBy)?.name 
            : null

          return {
            ...request,
            workbench: workbench ? workbench.name : 'Bancada não encontrada',
            approvedBy: approver || 'Não definido'
          }
        })

      console.log('User Requests:', userRequests)
      
      setRequests(userRequests)
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Erro ao carregar solicitações')
    }
  }, [userAuth])

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'green'
      case 'recusado': return 'red'
      case 'pendente': return 'yellow'
      default: return 'gray'
    }
  }

  const filteredRequests = useMemo(() => {
    if (!searchTerm) return requests;
    return requests.filter(request => 
      request.workbench.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.comments?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [requests, searchTerm]);

  if (error) {
    return (
      <Box p={6}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        {debugInfo && (
          <Box>
            <Flex alignItems="center" mb={2}>
              <Heading size="sm">Debug Information</Heading>
              <Spacer />
            </Flex>
            <Code whiteSpace="pre" p={4} w="full" overflowX="auto">
              {JSON.stringify(debugInfo, null, 2)}
            </Code>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Minhas Solicitações</Heading>
      <Flex direction="column" gap={4}>
        <NameSearchFilter 
          placeholder="Buscar por bancada, aprovador ou comentários" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        
        {filteredRequests.length === 0 ? (
          <Box textAlign="center" py={10}>
            <Text>Nenhuma solicitação encontrada.</Text>
          </Box>
        ) : (
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Bancada</Th>
                <Th>Data</Th>
                <Th>Horário</Th>
                <Th>Status</Th>
                <Th>Aprovado Por</Th>
                <Th>Comentários</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredRequests.map((request) => (
                <Tr key={request.id}>
                  <Td>{request.workbench}</Td>
                  <Td>{request.date}</Td>
                  <Td>{request.time}</Td>
                  <Td>
                    <Badge 
                      colorScheme={
                        request.status === 'aprovado' ? 'green' :
                        request.status === 'pendente' ? 'yellow' :
                        request.status === 'recusado' ? 'red' : 'gray'
                      }
                    >
                      {request.status}
                    </Badge>
                  </Td>
                  <Td>{request.approvedBy || 'Não aprovado'}</Td>
                  <Td>{request.comments || '-'}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Flex>
    </Box>
  )
}

export default UserRequests
