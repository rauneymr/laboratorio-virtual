import React from 'react'
import {
  Box,
  Heading,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FaTools, FaClock, FaRegLightbulb } from 'react-icons/fa'
import apiData from '../api.json'
import CreateProjectModal from './CreateProjectModal'
import useAuthStore from '../store/authStore'

const ProjectCard = ({ project = {}, showCreateButton = true, isAdminView = false }) => {
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useAuthStore()
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  // If no project is provided, show a placeholder
  if (!project || Object.keys(project).length === 0) {
    return (
      <>
        <Box
          p={5}
          borderWidth={1}
          borderRadius="lg"
          bg="white"
          shadow="sm"
          _hover={{ shadow: 'md' }}
        >
          <VStack spacing={4} align="stretch">
            <Icon as={FaRegLightbulb} boxSize={8} color="blue.500" alignSelf="center" />
            <VStack spacing={2} textAlign="center">
              <Heading size="md">Comece um Novo Projeto</Heading>
              <Text color="gray.600">
                Crie seu primeiro projeto para começar a utilizar as bancadas do laboratório
              </Text>
            </VStack>
            {showCreateButton && (
              <Button
                colorScheme="blue"
                leftIcon={<FaRegLightbulb />}
                onClick={onOpen}
                size="md"
                width="full"
              >
                Criar Novo Projeto
              </Button>
            )}
          </VStack>
        </Box>
        
        <CreateProjectModal isOpen={isOpen} onClose={onClose} />
      </>
    )
  }

  const { 
    id, 
    name, 
    description,
    status, 
    lastUpdated,
    workbenchId,
    ownerName
  } = project

  const workbench = apiData.workbenches.find(w => w.id === workbenchId)

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      bg="white"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      position="relative"
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between" align="center">
          <Heading size="md">{name}</Heading>
          <Badge 
            colorScheme={status === 'active' ? 'green' : 'gray'} 
            variant="solid"
          >
            {status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </HStack>

        <Text color="gray.600" noOfLines={2}>{description}</Text>

        {isAdminView && ownerName && (
          <HStack fontSize="sm" color="gray.500">
            <Text>Proprietário: {ownerName}</Text>
          </HStack>
        )}

        {workbench && (
          <HStack fontSize="sm" color="gray.500">
            <Icon as={FaTools} />
            <Text>{workbench.name}</Text>
          </HStack>
        )}

        <HStack fontSize="sm" color="gray.500">
          <Icon as={FaClock} />
          <Text>Atualizado em: {formatDate(lastUpdated)}</Text>
        </HStack>

        <HStack spacing={2} pt={2}>
          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => navigate(`/project/${id}/monitor`)}
            flex={1}
          >
            Monitorar
          </Button>
          {!isAdminView && (
            <Button
              size="sm"
              variant="outline"
              colorScheme="gray"
              onClick={() => navigate(`/project/${id}/config`)}
              isDisabled={status !== 'active'}
              flex={1}
            >
              Configurar
            </Button>
          )}
        </HStack>
      </VStack>
    </Box>
  )
}

export default ProjectCard
