import {
  Box,
  Grid,
  Heading,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'

const UserDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Projects</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Project
        </Button>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        <ProjectCard />
      </Grid>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default UserDashboard
