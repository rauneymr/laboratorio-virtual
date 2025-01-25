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
  Button
} from '@chakra-ui/react'

const AdminDashboard = () => {
  return (
    <Box>
      <Heading mb={6}>Admin Dashboard</Heading>
      
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Projects</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>user@example.com</Td>
              <Td>User</Td>
              <Td>
                <Badge colorScheme="green">Active</Badge>
              </Td>
              <Td>3</Td>
              <Td>
                <Button size="sm" colorScheme="red">
                  Disable
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  )
}

export default AdminDashboard
