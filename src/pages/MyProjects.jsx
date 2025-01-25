import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  VStack,
  Input,
  Flex,
  Button,
  Grid,
  useDisclosure,
  Text,
  Center
} from '@chakra-ui/react'
import { FaPlus } from 'react-icons/fa'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import apiData from '../api.json'
import useAuthStore from '../store/authStore'

const MyProjects = () => {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [projectSearchTerm, setProjectSearchTerm] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuthStore()

  useEffect(() => {
    // Find the current logged-in user from api.json
    const currentUser = apiData.users.find(u => u.email === user?.email)

    if (currentUser) {
      // Filter projects for the current user
      const userProjects = apiData.projects.filter(
        project => project.userId === currentUser.id.toString()
      )
      setProjects(userProjects)
    }
  }, [user])

  useEffect(() => {
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearchTerm.toLowerCase())
    )
    setFilteredProjects(filtered)
  }, [projects, projectSearchTerm])

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading size="lg">Meus Projetos</Heading>
          <Button 
            leftIcon={<FaPlus />} 
            colorScheme="blue" 
            onClick={onOpen}
          >
            Novo Projeto
          </Button>
        </Flex>

        <Input 
          placeholder="Buscar projeto" 
          value={projectSearchTerm} 
          onChange={(e) => setProjectSearchTerm(e.target.value)} 
          mb={4}
        />

        {filteredProjects.length === 0 ? (
          <Center>
            <Text color="gray.500">Nenhum projeto encontrado</Text>
          </Center>
        ) : (
          <Grid 
            templateColumns={["1fr", "repeat(auto-fill, minmax(300px, 1fr))"]} 
            gap={6}
          >
            {filteredProjects.map(project => {
              const projectOwner = apiData.users.find(u => u.id.toString() === project.userId)
              
              return (
                <ProjectCard 
                  key={project.id} 
                  project={{
                    ...project,
                    workbenchName: apiData.workbenches.find(wb => wb.id === project.workbenchId)?.name || 'Unknown Workbench',
                    ownerName: projectOwner?.name || 'Unknown Owner'
                  }}
                />
              )
            })}
          </Grid>
        )}
      </VStack>

      <CreateProjectModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

export default MyProjects
