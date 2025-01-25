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
import { format, parseISO, isBefore, isAfter, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from '../components/Calendar'
import apiData from '../api.json'

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

  const occupiedSlots = apiData.scheduling.occupiedDates
  const pendingSlots = apiData.scheduling.pendingDates

  const handleDateSelect = (date) => {
    // Check if the selected date is pending
    const isPendingDate = pendingSlots.some(slot => 
      parseISO(slot.start).toDateString() === parseISO(date).toDateString()
    )

    // If no start date is selected, set it
    if (!selectedStartDate) {
      if (isPendingDate) {
        toast({
          title: 'Atenção',
          description: 'Esta data possui um agendamento pendente de aprovação. A seleção pode não ser aceita.',
          status: 'warning',
          duration: 5000,
          isClosable: true
        })
      }
      setSelectedStartDate(date)
      setSelectedEndDate('')
      return
    }

    // If start date is already selected
    const startDate = parseISO(selectedStartDate)
    const endDate = parseISO(date)

    // If selecting the same start date, deselect it
    if (selectedStartDate === date) {
      setSelectedStartDate('')
      setSelectedEndDate('')
      return
    }

    // If end date is already selected and matches the clicked date, deselect it
    if (selectedEndDate === date) {
      setSelectedEndDate('')
      return
    }

    // Check if any date in the range is pending
    const dateRange = eachDayOfInterval({ start: startDate, end: endDate })
    const hasPendingDates = dateRange.some(d => 
      pendingSlots.some(slot => 
        parseISO(slot.start).toDateString() === d.toDateString()
      )
    )

    // If range includes pending dates, show warning
    if (hasPendingDates) {
      toast({
        title: 'Atenção',
        description: 'Alguns dias no período selecionado possuem agendamentos pendentes de aprovação. A seleção pode não ser aceita.',
        status: 'warning',
        duration: 5000,
        isClosable: true
      })
    }

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

    // Set end date
    setSelectedEndDate(date)
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
                  pendingDates={pendingSlots}
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

  const workbenches = apiData.workbenches

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
