import React, { useState } from 'react'
import {
  Box,
  Grid,
  Heading,
  Button,
  useDisclosure,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel
} from '@chakra-ui/react'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'

const UserDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState(0)

  // Find the current logged-in user from api.json
  const currentUser = apiData.users.find(u => u.email === user?.email)

  // Filter projects based on user role and email
  const personalProjects = currentUser 
    ? apiData.projects.filter(project => project.userId === currentUser.id.toString()) 
    : []

  // For admin, get all other projects (excluding their own)
  const otherProjects = currentUser?.role === 'admin'
    ? apiData.projects.filter(project => project.userId !== currentUser.id.toString())
    : []

  return (
    <Box>
      <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="lg">
          {currentUser?.role === 'admin' ? 'Projetos' : 'Meus Projetos'}
        </Heading>
        {currentUser?.role !== 'admin' && (
          <Button colorScheme="blue" onClick={onOpen}>
            Novo Projeto
          </Button>
        )}
      </Box>

      {currentUser?.role === 'admin' ? (
        <Tabs onChange={(index) => setActiveTab(index)} mb={6}>
          <TabList>
            <Tab>Meus Projetos</Tab>
            <Tab>Todos os Projetos</Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {personalProjects.length > 0 ? (
                  personalProjects.map(project => {
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
                  })
                ) : (
                  <Box textAlign="center" width="100%" py={10}>
                    <Text color="gray.500">Você não possui projetos</Text>
                    <ProjectCard />
                  </Box>
                )}
              </Grid>
            </TabPanel>
            <TabPanel px={0}>
              <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
                {otherProjects.length > 0 ? (
                  otherProjects.map(project => {
                    const projectOwner = apiData.users.find(u => u.id.toString() === project.userId)
                    
                    return (
                      <ProjectCard 
                        key={project.id} 
                        project={{
                          ...project,
                          workbenchName: apiData.workbenches.find(wb => wb.id === project.workbenchId)?.name || 'Unknown Workbench',
                          ownerName: projectOwner?.name || 'Unknown Owner'
                        }}
                        isAdminView={true}
                      />
                    )
                  })
                ) : (
                  <Box textAlign="center" width="100%" py={10}>
                    <Text color="gray.500">Não há projetos disponíveis</Text>
                  </Box>
                )}
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={6}>
          {personalProjects.length > 0 ? (
            personalProjects.map(project => {
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
            })
          ) : (
            <Box textAlign="center" width="100%" py={10}>
              <Text color="gray.500">Nenhum projeto encontrado</Text>
              <ProjectCard />
            </Box>
          )}
        </Grid>
      )}

      {currentUser?.role !== 'admin' && (
        <CreateProjectModal isOpen={isOpen} onClose={onClose} />
      )}
    </Box>
  )
}

export default UserDashboard
