import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useToast,
  HStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { format, parseISO, isBefore, isAfter } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from '../components/Calendar'

// WorkbenchCard Component
const WorkbenchCard = ({ workbench, onSchedule }) => (
  <Box
    p={5}
    borderWidth={1}
    borderRadius="lg"
    bg="white"
    shadow="sm"
    _hover={{ shadow: 'md' }}
  >
    <Heading size="md" mb={2}>{workbench.name}</Heading>
    <Text color="gray.600" mb={4}>{workbench.description}</Text>
    <Text mb={2}>Recursos:</Text>
    <Box mb={4}>
      {workbench.resources.map((resource, index) => (
        <Text key={index} fontSize="sm" color="gray.600">• {resource}</Text>
      ))}
    </Box>
    <Button colorScheme="blue" onClick={() => onSchedule(workbench)}>
      Agendar
    </Button>
  </Box>
)

// SchedulingModal Component
const SchedulingModal = ({ isOpen, onClose, workbench }) => {
  const toast = useToast()
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')

  const occupiedSlots = [
    {
      start: '2025-01-28T00:00:00',
      end: '2025-01-28T23:59:59'
    },
    {
      start: '2025-01-29T00:00:00',
      end: '2025-01-29T23:59:59'
    },
    {
      start: '2025-01-30T00:00:00',
      end: '2025-01-30T23:59:59'
    }
  ]

  const handleDateSelect = (date) => {
    if (!selectedStartDate) {
      // First date selection (start date)
      setSelectedStartDate(date)
      setSelectedEndDate('')
    } else {
      // Second date selection (end date)
      const startDate = parseISO(selectedStartDate)
      const endDate = parseISO(date)

      // Validate date order and prevent selecting past dates
      if (isBefore(endDate, startDate)) {
        toast({
          title: 'Data inválida',
          description: 'A data final deve ser posterior à data inicial.',
          status: 'error',
          duration: 3000
        })
        return
      }

      setSelectedEndDate(date)
    }
  }

  const resetSelection = () => {
    setSelectedStartDate('')
    setSelectedEndDate('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedStartDate || !selectedEndDate) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione o período',
        status: 'error',
        duration: 3000
      })
      return
    }

    console.log('Período selecionado:', { 
      startDate: selectedStartDate, 
      endDate: selectedEndDate 
    })

    toast({
      title: 'Solicitação enviada',
      description: 'Aguarde a aprovação do administrador.',
      status: 'success',
      duration: 3000
    })
    onClose()
  }

  const formatSelectedPeriod = () => {
    if (!selectedStartDate) return ''

    const formatDate = (date) => format(parseISO(date), "dd 'de' MMMM", { locale: ptBR })
    
    let text = `De ${formatDate(selectedStartDate)}`
    
    if (selectedEndDate) {
      text += ` até ${formatDate(selectedEndDate)}`
    } else {
      text += ' (selecione a data final)'
    }

    return text
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="stretch" spacing={2}>
            <Text>Agendar {workbench?.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {!selectedStartDate 
                ? 'Selecione a data inicial' 
                : !selectedEndDate 
                  ? 'Selecione a data final' 
                  : 'Confirme o agendamento'}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <Calendar
                  occupiedDates={occupiedSlots}
                  onSelectDate={handleDateSelect}
                  selectedStartDate={selectedStartDate}
                  selectedEndDate={selectedEndDate}
                />
              </FormControl>

              {selectedStartDate && (
                <Text fontWeight="bold" color="gray.700">
                  {formatSelectedPeriod()}
                </Text>
              )}

              <FormControl isRequired>
                <FormLabel>Objetivo do Experimento</FormLabel>
                <Textarea placeholder="Descreva o objetivo do seu experimento" />
              </FormControl>

              <FormControl>
                <FormLabel>Observações Adicionais</FormLabel>
                <Textarea placeholder="Alguma observação especial?" />
              </FormControl>

              <HStack spacing={4} w="full">
                <Button
                  onClick={resetSelection}
                  variant="outline"
                >
                  Limpar Seleção
                </Button>
                <Button
                  type="submit"
                  colorScheme="blue"
                  flex={1}
                  isDisabled={!selectedStartDate || !selectedEndDate}
                >
                  Enviar Solicitação
                </Button>
              </HStack>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Main Scheduling Component
const Scheduling = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedWorkbench, setSelectedWorkbench] = useState(null)

  const workbenches = [
    {
      id: 1,
      name: 'Bancada de Controle de Processos',
      description: 'Bancada para experimentos de controle de processos industriais',
      resources: ['PLC Siemens S7-1200', 'Sensores de temperatura', 'Válvulas de controle']
    },
    {
      id: 2,
      name: 'Bancada de Instrumentação',
      description: 'Bancada para calibração e teste de instrumentos',
      resources: ['Calibrador de pressão', 'Multímetro de precisão', 'Osciloscópio']
    }
  ]

  const handleSchedule = (workbench) => {
    setSelectedWorkbench(workbench)
    onOpen()
  }

  return (
    <Box>
      <Heading mb={6}>Agendamento de Bancadas</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {workbenches.map(workbench => (
          <WorkbenchCard
            key={workbench.id}
            workbench={workbench}
            onSchedule={handleSchedule}
          />
        ))}
      </SimpleGrid>

      <SchedulingModal
        isOpen={isOpen}
        onClose={onClose}
        workbench={selectedWorkbench}
      />
    </Box>
  )
}

export default Scheduling
