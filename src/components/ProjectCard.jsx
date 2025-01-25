import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  HStack
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

const ProjectCard = ({ project }) => {
  const navigate = useNavigate()
  
  // Dummy project data for demonstration
  const dummyProject = {
    id: 1,
    name: 'Test Project',
    status: 'active',
    lastUpdated: '2023-09-20'
  }

  const { id, name, status, lastUpdated } = project || dummyProject

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      shadow="sm"
      _hover={{ shadow: 'md' }}
    >
      <Heading size="md" mb={2}>{name}</Heading>
      <Badge colorScheme={status === 'active' ? 'green' : 'gray'} mb={4}>
        {status}
      </Badge>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Last updated: {lastUpdated}
      </Text>
      <HStack spacing={2}>
        <Button
          size="sm"
          colorScheme="blue"
          onClick={() => navigate(`/project/${id}/monitor`)}
        >
          Monitor
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/project/${id}/config`)}
        >
          Configure
        </Button>
      </HStack>
    </Box>
  )
}

export default ProjectCard
