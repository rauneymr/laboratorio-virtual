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
  Text,
  VStack
} from '@chakra-ui/react'
import useAuthStore from '../store/authStore'

const UserRequests = () => {
  const user = useAuthStore(state => state.user)
  const [requests] = useState([
    {
      id: 1,
      workbench: 'Bancada de Eletrônica',
      date: '2024-02-15',
      time: '14:00',
      status: 'aprovado',
      approvedBy: 'João Silva',
      comments: ''
    },
    {
      id: 2,
      workbench: 'Bancada de Robótica',
      date: '2024-02-20',
      time: '10:00',
      status: 'recusado',
      approvedBy: 'Maria Souza',
      comments: 'Bancada em manutenção'
    },
    {
      id: 3,
      workbench: 'Bancada de Computação',
      date: '2024-02-25',
      time: '16:00',
      status: 'pendente',
      approvedBy: null,
      comments: ''
    }
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case 'aprovado': return 'green'
      case 'recusado': return 'red'
      case 'pendente': return 'yellow'
      default: return 'gray'
    }
  }

  return (
    <Box p={6}>
      <Heading mb={6}>Minhas Solicitações</Heading>
      
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
              <Td>{request.approvedBy || 'Não definido'}</Td>
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
    </Box>
  )
}

export default UserRequests
