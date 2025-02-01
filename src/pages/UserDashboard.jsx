import React, { useState, useMemo } from 'react'
import { 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Icon,
  VStack,
  HStack,
  Tooltip,
  Badge,
  Button,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Input,
  useBreakpointValue,
  Wrap,
  WrapItem
} from '@chakra-ui/react'
import { 
  FaCalendarAlt, 
  FaRegClock, 
  FaProjectDiagram, 
  FaTools, 
  FaClipboardList, 
  FaUser,
  FaCalendarTimes,
  FaPlus
} from 'react-icons/fa'
import ProjectCard from '../components/ProjectCard'
import CreateProjectModal from '../components/CreateProjectModal'
import NameSearchFilter from '../components/NameSearchFilter'
import useAuthStore from '../store/authStore'
import apiData from '../api.json'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const UserDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState(0)

  // Find the current logged-in user from api.json
  const currentUser = apiData.users.find(u => u.email === user?.email)

  // General Dashboard Statistics (for admin's Geral view)
  const generalDashboardStats = useMemo(() => {
    if (!currentUser || currentUser.role !== 'admin') return null

    // Count projects by status
    const projectStatusCounts = apiData.projects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1
      return acc
    }, {})

    // Count workbenches
    const workbenchCounts = apiData.workbenches.reduce((acc, wb) => {
      acc[wb.name] = apiData.projects.filter(p => p.workbenchId === wb.id).length
      return acc
    }, {})

    // Prepare data for charts
    const projectStatusData = Object.entries(projectStatusCounts).map(([status, count]) => ({
      name: status === 'active' ? 'Ativos' : 'Inativos',
      value: count
    }))

    const workbenchData = Object.entries(workbenchCounts).map(([name, count]) => ({
      name,
      value: count
    }))

    return {
      totalProjects: apiData.projects.length,
      totalWorkbenches: apiData.workbenches.length,
      totalUsers: apiData.users.length,
      projectStatusData,
      workbenchData
    }
  }, [currentUser])

  // Personal Dashboard Statistics (for admin's Pessoal view)
  const personalDashboardStats = useMemo(() => {
    if (!currentUser) return null

    // Count user's projects by status
    const userProjectStatusCounts = apiData.projects
      .filter(project => project.userId === currentUser.id.toString())
      .reduce((acc, project) => {
        acc[project.status] = (acc[project.status] || 0) + 1
        return acc
      }, {})

    // Count user's workbenches
    const userWorkbenchCounts = apiData.projects
      .filter(project => project.userId === currentUser.id.toString())
      .reduce((acc, project) => {
        const workbench = apiData.workbenches.find(wb => wb.id === project.workbenchId)
        if (workbench) {
          acc[workbench.name] = (acc[workbench.name] || 0) + 1
        }
        return acc
      }, {})

    // Count user's pending requests from api.json
    const pendingRequests = apiData.requests
      ? apiData.requests.filter(request => 
          request.userId === currentUser.id.toString() && 
          request.status === 'pending'
        ).length
      : 0

    // Prepare data for charts
    const projectStatusData = Object.entries(userProjectStatusCounts).map(([status, count]) => ({
      name: status === 'active' ? 'Ativos' : 'Inativos',
      value: count
    }))

    const workbenchData = Object.entries(userWorkbenchCounts).map(([name, count]) => ({
      name,
      value: count
    }))

    return {
      totalProjects: apiData.projects.filter(project => project.userId === currentUser.id.toString()).length,
      totalWorkbenches: Object.keys(userWorkbenchCounts).length,
      pendingRequests,
      projectStatusData,
      workbenchData
    }
  }, [currentUser])

  // Prepare active schedules data
  const activeSchedules = useMemo(() => {
    if (!currentUser) return []

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    console.log('Current User:', currentUser)
    console.log('All Requests:', apiData.scheduling?.requests)
    console.log('Today (start of day):', today)

    // Filter and process active requests
    const filteredSchedules = apiData.scheduling?.requests
      ? apiData.scheduling.requests
          .filter(request => {
            const isMatchingUser = request.userId.toString() === currentUser.id.toString()
            const isApprovedStatus = request.status === 'aprovado'
            
            // Parse dates and set to start of day for consistent comparison
            const startDate = new Date(request.startDate)
            const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate())
            
            const endDate = new Date(request.endDate)
            const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate())

            // Adjust end date to include the full day
            endDateOnly.setHours(23, 59, 59, 999)

            const isWithinDateRange = startDateOnly <= today && today <= endDateOnly

            console.log(`Request: ${request.id}`, {
              isMatchingUser,
              isApprovedStatus,
              startDateOnly: startDateOnly.toISOString(),
              endDateOnly: endDateOnly.toISOString(),
              today: today.toISOString(),
              startDateOriginal: request.startDate,
              endDateOriginal: request.endDate,
              isWithinDateRange
            })

            return isMatchingUser && isApprovedStatus && isWithinDateRange
          })
          .map(request => {
            const startDate = new Date(request.startDate)
            const expirationDate = new Date(request.endDate)
            const daysLeft = Math.ceil(
              (expirationDate - now) / (1000 * 60 * 60 * 24)
            )

            return {
              id: request.id,
              name: `Bancada ${request.workbenchId} - ${request.comments}`,
              startDate: startDate.toLocaleDateString('pt-BR'),
              expirationDate: expirationDate.toLocaleDateString('pt-BR'),
              daysLeft: daysLeft,
              status: daysLeft <= 0 
                ? 'Vencido' 
                : daysLeft <= 7 
                  ? 'Expirando' 
                  : 'Ativo'
            }
          })
          .sort((a, b) => a.daysLeft - b.daysLeft)
          .slice(0, 5) // Top 5 schedules
      : []

    console.log('Filtered Schedules:', filteredSchedules)
    return filteredSchedules
  }, [currentUser, apiData.scheduling?.requests])

  // Filter projects based on user role and email
  const personalProjects = currentUser 
    ? apiData.projects.filter(project => project.userId === currentUser.id.toString()) 
    : []

  // For admin, get all other projects (excluding their own)
  const otherProjects = currentUser?.role === 'admin'
    ? apiData.projects.filter(project => project.userId !== currentUser.id.toString())
    : []

  // Project Search Filter
  const [projectSearchTerm, setProjectSearchTerm] = useState('')

  const filteredPersonalProjects = useMemo(() => {
    if (!projectSearchTerm) return personalProjects

    return personalProjects.filter(project => 
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearchTerm.toLowerCase())
    )
  }, [personalProjects, projectSearchTerm])

  const filteredOtherProjects = useMemo(() => {
    if (!projectSearchTerm) return otherProjects

    return otherProjects.filter(project => 
      project.name.toLowerCase().includes(projectSearchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearchTerm.toLowerCase())
    )
  }, [otherProjects, projectSearchTerm])

  // Render method
  return (
    <Box>
      <Box mb={6} display="flex" justifyContent="space-between" alignItems="center">
        <Heading size="lg">Dashboard</Heading>
      </Box>

      {/* Create Project Modal */}
      <CreateProjectModal 
        isOpen={isOpen} 
        onClose={onClose} 
      />

      {currentUser?.role === 'admin' ? (
        <Tabs onChange={(index) => setActiveTab(index)} mb={6}>
          <TabList>
            <Tab>Geral</Tab>
            <Tab>Pessoal</Tab>
          </TabList>
          <TabPanels>
            {/* Geral Tab - System-wide Dashboard */}
            <TabPanel px={0}>
              {generalDashboardStats && (
                <Box>
                  <Wrap 
                    spacing={4} 
                    justify="center" 
                    align="center" 
                    width="100%"
                  >
                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaProjectDiagram size="2em" color="#0088FE" />
                          <StatLabel>Total de Projetos</StatLabel>
                        </HStack>
                        <StatNumber>{generalDashboardStats.totalProjects}</StatNumber>
                      </Stat>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaTools size="2em" color="#00C49F" />
                          <StatLabel>Bancadas</StatLabel>
                        </HStack>
                        <StatNumber>{generalDashboardStats.totalWorkbenches}</StatNumber>
                      </Stat>
                    </WrapItem>
                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaUser size="2em" color="#FFBB28" />
                          <StatLabel>Total de Usuários</StatLabel>
                        </HStack>
                        <StatNumber>{generalDashboardStats.totalUsers}</StatNumber>
                      </Stat>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaClipboardList size="2em" color="#FF8042" />
                          <StatLabel>Solicitações Pendentes</StatLabel>
                        </HStack>
                        <StatNumber>0</StatNumber>
                      </Stat>
                    </WrapItem>
                  </Wrap>

                  <Divider my={6} />

                  <Wrap 
                    spacing={6} 
                    justify="center" 
                    width="100%"
                  >
                    <WrapItem 
                      flex={["1 1 100%", "1 1 45%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Box 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <Heading size="md" mb={4}>Status dos Projetos</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={generalDashboardStats.projectStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {generalDashboardStats.projectStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 45%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Box 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <Heading size="md" mb={4}>Projetos por Bancada</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={generalDashboardStats.workbenchData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    </WrapItem>
                  </Wrap>

                  <Divider my={6} />

                  {otherProjects.length > 0 && (
                    <Box  p={4} borderRadius="md" boxShadow="sm" width="100%">
                      <Heading size="md" mb={4}>Todos os Projetos</Heading>
                      <Input 
                        placeholder="Buscar projeto" 
                        value={projectSearchTerm} 
                        onChange={(e) => setProjectSearchTerm(e.target.value)} 
                        mb={4}
                      />
                      <Grid 
                        templateColumns={["1fr", "repeat(auto-fill, minmax(300px, 1fr))"]} 
                        gap={6}
                      >
                        {filteredOtherProjects.map(project => {
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
                        })}
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}
            </TabPanel>

            {/* Pessoal Tab - User's Personal Dashboard */}
            <TabPanel px={0}>
              {personalDashboardStats && (
                <Box>
                  <Wrap 
                    spacing={4} 
                    justify="center" 
                    align="center" 
                    width="100%"
                  >
                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaProjectDiagram size="2em" color="#0088FE" />
                          <StatLabel>Total de Projetos</StatLabel>
                        </HStack>
                        <StatNumber>{personalDashboardStats.totalProjects}</StatNumber>
                      </Stat>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaClipboardList size="2em" color="#FF8042" />
                          <StatLabel>Solicitações Pendentes</StatLabel>
                        </HStack>
                        <StatNumber>{personalDashboardStats.pendingRequests}</StatNumber>
                      </Stat>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Stat 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <HStack spacing={3} mb={4}>
                          <FaTools size="2em" color="#00C49F" />
                          <StatLabel>Bancadas</StatLabel>
                        </HStack>
                        <StatNumber>3</StatNumber>
                      </Stat>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 22%"]} 
                      minWidth={["100%", "auto"]}
                      display="flex"
                      alignItems="stretch"
                    >
                      <Button 
                        leftIcon={<FaPlus />} 
                        colorScheme="blue" 
                        onClick={onOpen}
                        size="lg"
                        width="100%"
                        height="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        p={4}
                        fontSize="md"
                      >
                        Novo Projeto
                      </Button>
                    </WrapItem>
                  </Wrap>

                  <Divider my={6} />

                  <Wrap 
                    spacing={6} 
                    justify="center" 
                    width="100%"
                  >
                    <WrapItem 
                      flex={["1 1 100%", "1 1 45%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Box 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <Heading size="md" mb={4}>Status dos Projetos</Heading>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={personalDashboardStats.projectStatusData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {personalDashboardStats.projectStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </WrapItem>

                    <WrapItem 
                      flex={["1 1 100%", "1 1 45%"]} 
                      minWidth={["100%", "auto"]}
                    >
                      <Box 
                        p={5} 
                        borderWidth={1} 
                        borderRadius="lg" 
                        
                        shadow="sm"
                        _hover={{ shadow: 'md' }}
                        width="100%"
                      >
                        <Heading size="md" mb={4}>Agendamentos Ativos</Heading>
                        {activeSchedules.length > 0 ? (
                          <VStack spacing={3} align="stretch">
                            {activeSchedules.map((schedule) => (
                              <Flex 
                                key={schedule.id} 
                                align="center" 
                                justify="space-between"
                                bg={
                                  schedule.status === 'Vencido' 
                                    ? 'red.50' 
                                    : schedule.status === 'Expirando' 
                                      ? 'orange.50' 
                                      : 'green.50'
                                }
                                p={3}
                                borderRadius="md"
                                borderLeft="4px solid"
                                borderLeftColor={
                                  schedule.status === 'Vencido' 
                                    ? 'red.500' 
                                    : schedule.status === 'Expirando' 
                                      ? 'orange.500' 
                                      : 'green.500'
                                }
                              >
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="bold" color="gray.700">{schedule.name}</Text>
                                  <HStack spacing={4}>
                                    <Tooltip label="Data de Início">
                                      <Flex align="center">
                                        <Icon as={FaCalendarAlt} mr={2} color="gray.500" />
                                        <Text fontSize="sm" color="gray.600">{schedule.startDate}</Text>
                                      </Flex>
                                    </Tooltip>
                                    <Tooltip label="Data de Expiração">
                                      <Flex align="center">
                                        <Icon as={FaRegClock} mr={2} color="gray.500" />
                                        <Text fontSize="sm" color="gray.600">{schedule.expirationDate}</Text>
                                      </Flex>
                                    </Tooltip>
                                  </HStack>
                                  <Badge 
                                    colorScheme={
                                      schedule.status === 'Vencido' 
                                        ? 'red' 
                                        : schedule.status === 'Expirando' 
                                          ? 'orange' 
                                          : 'green'
                                    }
                                    variant="solid"
                                  >
                                    {schedule.status} ({schedule.daysLeft} dias)
                                  </Badge>
                                </VStack>
                              </Flex>
                            ))}
                          </VStack>
                        ) : (
                          <Flex 
                            justifyContent="center" 
                            alignItems="center" 
                            height="200px" 
                            flexDirection="column"
                            color="gray.500"
                            textAlign="center"
                          >
                            <Icon as={FaCalendarTimes} boxSize={12} mb={4} />
                            <Text>Nenhum agendamento ativo no momento</Text>
                          </Flex>
                        )}
                      </Box>
                    </WrapItem>
                  </Wrap>

                  <Grid 
                    templateColumns="1fr" 
                    gap={6} 
                    width="100%"
                  >
                    <Box  p={4} borderRadius="md" boxShadow="sm" width="100%">
                      <Heading size="md" mb={4}>Meus Projetos</Heading>
                      <Input 
                        placeholder="Buscar projeto" 
                        value={projectSearchTerm} 
                        onChange={(e) => setProjectSearchTerm(e.target.value)} 
                        mb={4}
                      />
                      <Grid 
                        templateColumns={filteredPersonalProjects.length > 0 
                          ? ["1fr", "repeat(auto-fill, minmax(300px, 1fr))"] 
                          : "1fr"
                        } 
                        gap={6}
                        width="100%"
                      >
                        {filteredPersonalProjects.length > 0 ? (
                          filteredPersonalProjects.map(project => {
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
                          <Flex 
                            justifyContent="center" 
                            alignItems="center" 
                            height="200px" 
                            width="100%"
                            color="gray.500"
                            textAlign="center"
                          >
                            <Text>Nenhum projeto encontrado</Text>
                          </Flex>
                        )}
                      </Grid>
                    </Box>
                  </Grid>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      ) : (
        // Non-admin user view
        <Box>
          {personalDashboardStats && (
            <Box>
              <Wrap 
                spacing={4} 
                justify="center" 
                align="center" 
                width="100%"
              >
                <WrapItem 
                  flex={["1 1 100%", "1 1 22%"]} 
                  minWidth={["100%", "auto"]}
                >
                  <Stat 
                    p={5} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    width="100%"
                  >
                    <HStack spacing={3} mb={4}>
                      <FaProjectDiagram size="2em" color="#0088FE" />
                      <StatLabel>Total de Projetos</StatLabel>
                    </HStack>
                    <StatNumber>{personalDashboardStats.totalProjects}</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem 
                  flex={["1 1 100%", "1 1 22%"]} 
                  minWidth={["100%", "auto"]}
                >
                  <Stat 
                    p={5} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    width="100%"
                  >
                    <HStack spacing={3} mb={4}>
                      <FaClipboardList size="2em" color="#FF8042" />
                      <StatLabel>Solicitações Pendentes</StatLabel>
                    </HStack>
                    <StatNumber>{personalDashboardStats.pendingRequests}</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem 
                  flex={["1 1 100%", "1 1 22%"]} 
                  minWidth={["100%", "auto"]}
                >
                  <Stat 
                    p={5} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    width="100%"
                  >
                    <HStack spacing={3} mb={4}>
                      <FaTools size="2em" color="#00C49F" />
                      <StatLabel>Bancadas</StatLabel>
                    </HStack>
                    <StatNumber>3</StatNumber>
                  </Stat>
                </WrapItem>

                <WrapItem 
                  flex={["1 1 100%", "1 1 22%"]} 
                  minWidth={["100%", "auto"]}
                  display="flex"
                  alignItems="stretch"
                >
                  <Button 
                    leftIcon={<FaPlus />} 
                    colorScheme="blue" 
                    onClick={onOpen}
                    size="lg"
                    width="100%"
                    height="100%"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    p={4}
                    fontSize="md"
                  >
                    Novo Projeto
                  </Button>
                </WrapItem>
              </Wrap>

              <Divider my={6} />

              <Wrap 
                spacing={6} 
                justify="center" 
                width="100%"
              >
                <WrapItem 
                  flex={["1 1 100%", "1 1 45%"]} 
                  minWidth={["100%", "auto"]}
                >
                  <Box 
                    p={5} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    width="100%"
                  >
                    <Heading size="md" mb={4}>Status dos Projetos</Heading>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={personalDashboardStats.projectStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {personalDashboardStats.projectStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </WrapItem>

                <WrapItem 
                  flex={["1 1 100%", "1 1 45%"]} 
                  minWidth={["100%", "auto"]}
                >
                  <Box 
                    p={5} 
                    borderWidth={1} 
                    borderRadius="lg" 
                    
                    shadow="sm"
                    _hover={{ shadow: 'md' }}
                    width="100%"
                  >
                    <Heading size="md" mb={4}>Agendamentos Ativos</Heading>
                    {activeSchedules.length > 0 ? (
                      <VStack spacing={3} align="stretch">
                        {activeSchedules.map((schedule) => (
                          <Flex 
                            key={schedule.id} 
                            align="center" 
                            justify="space-between"
                            bg={
                              schedule.status === 'Vencido' 
                                ? 'red.50' 
                                : schedule.status === 'Expirando' 
                                  ? 'orange.50' 
                                  : 'green.50'
                            }
                            p={3}
                            borderRadius="md"
                            borderLeft="4px solid"
                            borderLeftColor={
                              schedule.status === 'Vencido' 
                                ? 'red.500' 
                                : schedule.status === 'Expirando' 
                                  ? 'orange.500' 
                                  : 'green.500'
                            }
                          >
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="bold" color="gray.700">{schedule.name}</Text>
                              <HStack spacing={4}>
                                <Tooltip label="Data de Início">
                                  <Flex align="center">
                                    <Icon as={FaCalendarAlt} mr={2} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600">{schedule.startDate}</Text>
                                  </Flex>
                                </Tooltip>
                                <Tooltip label="Data de Expiração">
                                  <Flex align="center">
                                    <Icon as={FaRegClock} mr={2} color="gray.500" />
                                    <Text fontSize="sm" color="gray.600">{schedule.expirationDate}</Text>
                                  </Flex>
                                </Tooltip>
                              </HStack>
                              <Badge 
                                colorScheme={
                                  schedule.status === 'Vencido' 
                                    ? 'red' 
                                    : schedule.status === 'Expirando' 
                                      ? 'orange' 
                                      : 'green'
                                }
                                variant="solid"
                              >
                                {schedule.status} ({schedule.daysLeft} dias)
                              </Badge>
                            </VStack>
                          </Flex>
                        ))}
                      </VStack>
                    ) : (
                      <Flex 
                        justifyContent="center" 
                        alignItems="center" 
                        height="200px" 
                        flexDirection="column"
                        color="gray.500"
                        textAlign="center"
                      >
                        <Icon as={FaCalendarTimes} boxSize={12} mb={4} />
                        <Text>Nenhum agendamento ativo no momento</Text>
                      </Flex>
                    )}
                  </Box>
                </WrapItem>
              </Wrap>

              <Grid 
                templateColumns="1fr" 
                gap={6} 
                width="100%"
              >
                <Box  p={4} borderRadius="md" boxShadow="sm" width="100%">
                  <Heading size="md" mb={4}>Meus Projetos</Heading>
                  <Input 
                    placeholder="Buscar projeto" 
                    value={projectSearchTerm} 
                    onChange={(e) => setProjectSearchTerm(e.target.value)} 
                    mb={4}
                  />
                  <Grid 
                    templateColumns={filteredPersonalProjects.length > 0 
                      ? ["1fr", "repeat(auto-fill, minmax(300px, 1fr))"] 
                      : "1fr"
                    } 
                    gap={6}
                    width="100%"
                  >
                    {filteredPersonalProjects.length > 0 ? (
                      filteredPersonalProjects.map(project => {
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
                      <Flex 
                        justifyContent="center" 
                        alignItems="center" 
                        height="200px" 
                        width="100%"
                        color="gray.500"
                        textAlign="center"
                      >
                        <Text>Nenhum projeto encontrado</Text>
                      </Flex>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </Box>
  )
}

export default UserDashboard
