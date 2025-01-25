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
  Alert,
  AlertIcon,
  HStack
} from '@chakra-ui/react'
import { useState } from 'react'
import { format, parseISO, isWithinInterval, addHours, isSameDay, isBefore } from 'date-fns'
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

// TimeSlotPicker Component
const TimeSlotPicker = ({ occupiedSlots, onTimeSelect, selectedDate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const isSlotOccupied = (hour) => {
    const slotStart = new Date(selectedDate)
    slotStart.setHours(hour, 0, 0, 0)
    
    return occupiedSlots.some(slot => {
      const start = parseISO(slot.start)
      const end = parseISO(slot.end)
      return isWithinInterval(slotStart, { start, end }) ||
             isWithinInterval(addHours(slotStart, 1), { start, end })
    })
  }

  return (
    <SimpleGrid columns={{ base: 4, md: 6 }} spacing={2} mt={4}>
      {hours.map(hour => (
        <Button
          key={hour}
          size="sm"
          colorScheme={isSlotOccupied(hour) ? 'red' : 'blue'}
          opacity={isSlotOccupied(hour) ? 0.7 : 1}
          onClick={() => !isSlotOccupied(hour) && onTimeSelect(hour)}
          isDisabled={isSlotOccupied(hour)}
        >
          {`${hour.toString().padStart(2, '0')}:00`}
        </Button>
      ))}
    </SimpleGrid>
  )
}

// SchedulingModal Component
const SchedulingModal = ({ isOpen, onClose, workbench }) => {
  const toast = useToast()
  const [selectedStartDate, setSelectedStartDate] = useState('')
  const [selectedEndDate, setSelectedEndDate] = useState('')
  const [selectedStartHour, setSelectedStartHour] = useState(null)
  const [selectedEndHour, setSelectedEndHour] = useState(null)
  const [selectionStep, setSelectionStep] = useState('start')

  const occupiedSlots = [
    {
      // Dia 28 totalmente ocupado explicitamente
      start: '2025-01-28T00:00:00',
      end: '2025-01-28T23:59:59'
    },
    {
      // Dia 29 totalmente ocupado através de múltiplos slots
      start: '2025-01-29T00:00:00',
      end: '2025-01-29T23:59:59'
    },
    {
      // Dia 30 com todos os horários iniciais ocupados
      start: '2025-01-30T08:00:00',
      end: '2025-01-30T19:00:00'
    },
    {
      // Dia 31 parcialmente ocupado
      start: '2025-01-31T09:00:00',
      end: '2025-01-31T12:00:00'
    },
    {
      start: '2025-01-31T14:00:00',
      end: '2025-01-31T16:00:00'
    }
  ]

  const handleDateSelect = (date) => {
    if (selectionStep === 'start') {
      setSelectedStartDate(date)
      setSelectedEndDate('')
      setSelectionStep('end')
      setSelectedStartHour(null)
      setSelectedEndHour(null)
    } else {
      const startDate = parseISO(selectedStartDate)
      const endDate = parseISO(date)

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
      setSelectionStep('start')
    }
  }

  const resetSelection = () => {
    setSelectedStartDate('')
    setSelectedEndDate('')
    setSelectedStartHour(null)
    setSelectedEndHour(null)
    setSelectionStep('start')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!selectedStartDate || !selectedEndDate || 
        selectedStartHour === null || selectedEndHour === null) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione o período e horários válidos',
        status: 'error',
        duration: 3000
      })
      return
    }

    const startDateTime = `${selectedStartDate}T${String(selectedStartHour).padStart(2, '0')}:00:00`
    const endDateTime = `${selectedEndDate}T${String(selectedEndHour).padStart(2, '0')}:00:00`

    console.log('Período selecionado:', { startDateTime, endDateTime })

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
    if (selectedStartHour !== null) {
      text += ` às ${String(selectedStartHour).padStart(2, '0')}:00`
    }
    
    if (selectedEndDate) {
      text += ` até ${formatDate(selectedEndDate)}`
      if (selectedEndHour !== null) {
        text += ` às ${String(selectedEndHour).padStart(2, '0')}:00`
      }
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
              {selectionStep === 'start' ? 
                'Selecione a data inicial' : 
                'Selecione a data final'}
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
                <Text fontSize="sm" color="gray.600" mt={2}>
                  Legenda:
                  <HStack spacing={4} mt={1}>
                    <HStack>
                      <Box w="3" h="3" bg="red.100" borderRadius="sm" />
                      <Text>Totalmente ocupado</Text>
                    </HStack>
                    <HStack>
                      <Box w="3" h="3" bg="yellow.100" borderRadius="sm" />
                      <Text>Parcialmente ocupado</Text>
                    </HStack>
                    <HStack>
                      <Box w="3" h="3" bg="blue.50" borderRadius="sm" />
                      <Text>Período selecionado</Text>
                    </HStack>
                  </HStack>
                </Text>
              </FormControl>

              {selectedStartDate && (
                <FormControl>
                  <FormLabel>Horário Inicial</FormLabel>
                  <TimeSlotPicker
                    occupiedSlots={occupiedSlots}
                    onTimeSelect={setSelectedStartHour}
                    selectedDate={selectedStartDate}
                  />
                </FormControl>
              )}

              {selectedEndDate && (
                <FormControl>
                  <FormLabel>Horário Final</FormLabel>
                  <TimeSlotPicker
                    occupiedSlots={occupiedSlots}
                    onTimeSelect={setSelectedEndHour}
                    selectedDate={selectedEndDate}
                  />
                </FormControl>
              )}

              {formatSelectedPeriod() && (
                <Alert status="info">
                  <AlertIcon />
                  {formatSelectedPeriod()}
                </Alert>
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
                  isDisabled={!selectedStartDate || !selectedEndDate || 
                             selectedStartHour === null || selectedEndHour === null}
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
