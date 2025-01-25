import React, { useState, useEffect } from 'react'
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
  Text,
  VStack,
  Alert,
  AlertIcon,
  Code,
  Flex,
  Spacer
} from '@chakra-ui/react'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'

const UserRequests = () => {
  const userAuth = useAuthStore(state => state.user)
  const [requests, setRequests] = useState([])
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

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
      
      {requests.length === 0 ? (
        <Text>Nenhuma solicitação encontrada.</Text>
      ) : (
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Bancada</Th>
              <Th>Data</Th>
              <Th>Horário</Th>
              <Th>Status</Th>
              <Th>Aprovado/Recusado Por</Th>
              <Th>Comentários</Th>
            </Tr>
          </Thead>
          <Tbody>
            {requests.map((request) => (
              <Tr key={request.id}>
                <Td>{request.workbench}</Td>
                <Td>{request.date}</Td>
                <Td>{request.time}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </Td>
                <Td>{request.approvedBy}</Td>
                <Td>
                  {request.comments ? (
                    <Text color="gray.500">{request.comments}</Text>
                  ) : (
                    <Text color="gray.400">Sem comentários</Text>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  )
}

export default UserRequests
