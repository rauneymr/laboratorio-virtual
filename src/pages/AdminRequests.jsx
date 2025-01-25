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
  useToast
} from '@chakra-ui/react'

const RequestsTable = ({ requests, onApprove, onReject }) => (
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Solicitante</Th>
        <Th>Tipo</Th>
        <Th>Data</Th>
        <Th>Status</Th>
        <Th>Ações</Th>
      </Tr>
    </Thead>
    <Tbody>
      {requests.map((request) => (
        <Tr key={request.id}>
          <Td>{request.user}</Td>
          <Td>{request.type}</Td>
          <Td>{request.date}</Td>
          <Td>
            <Badge colorScheme={request.status === 'pending' ? 'yellow' : 'green'}>
              {request.status}
            </Badge>
          </Td>
          <Td>
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="green"
                onClick={() => onApprove(request.id)}
              >
                Aprovar
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => onReject(request.id)}
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
  const toast = useToast()

  // Dados de exemplo
  const userRequests = [
    {
      id: 1,
      user: 'João Silva',
      type: 'Cadastro',
      date: '2023-09-20',
      status: 'pending'
    }
  ]

  const scheduleRequests = [
    {
      id: 1,
      user: 'Maria Santos',
      type: 'Agendamento - Bancada de Controle',
      date: '2023-09-21 14:00',
      status: 'pending'
    }
  ]

  const handleApprove = (id) => {
    toast({
      title: 'Solicitação aprovada',
      status: 'success',
      duration: 2000
    })
  }

  const handleReject = (id) => {
    toast({
      title: 'Solicitação rejeitada',
      status: 'error',
      duration: 2000
    })
  }

  return (
    <Box>
      <Heading mb={6}>Solicitações Pendentes</Heading>

      <Tabs>
        <TabList>
          <Tab>Usuários</Tab>
          <Tab>Agendamentos</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <RequestsTable
              requests={userRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabPanel>
          <TabPanel>
            <RequestsTable
              requests={scheduleRequests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default AdminRequests
