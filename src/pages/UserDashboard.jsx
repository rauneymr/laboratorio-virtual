import React from 'react'
import {
  Box,
  Grid,
  Heading,
  Button,
  useDisclosure,
  Text
} from '@chakra-ui/react'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'

const UserDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuthStore()

  // Find the current logged-in user from api.json
  const currentUser = apiData.users.find(u => u.email === user?.email)

  // Filter projects based on user role and email
  const filteredProjects = currentUser ? apiData.projects.filter(project => {
    // For admin, only show projects created by admins
    if (currentUser.role === 'admin') {
      const projectOwner = apiData.users.find(u => u.id.toString() === project.userId)
      return projectOwner?.role === 'admin'
    }
    
    // For other users, show their own projects
    return project.userId === currentUser.id.toString()
  }) : []

  return (
    <Box>
      <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Projects</Heading>
        <Button colorScheme="blue" onClick={onOpen}>
          Create Project
        </Button>
      </Box>

      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={{
                ...project,
                workbenchName: apiData.workbenches.find(wb => wb.id === project.workbenchId)?.name || 'Unknown Workbench'
              }} 
            />
          ))
        ) : (
          <Box textAlign="center" width="100%" py={10}>
            <Text color="gray.500">No projects found</Text>
            <ProjectCard />
          </Box>
        )}
      </Grid>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default UserDashboard
