import {
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
  HStack,
  Button,
  Text,
  Box
} from '@chakra-ui/react'
import { useState } from 'react'
import { format, parseISO, isBefore } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from '../../components/Calendar'
import { TimeSlotPicker } from './TimeSlotPicker'

export function SchedulingModal({ isOpen, onClose, workbench }) {
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
      end: '2025-01-29T08:00:00'
    },
    {
      start: '2025-01-29T08:00:00',
      end: '2025-01-29T16:00:00'
    },
    {
      start: '2025-01-29T16:00:00',
      end: '2025-01-29T23:59:59'
    },
    {
      // Dia 30 parcialmente ocupado
      start: '2025-01-30T08:00:00',
      end: '2025-01-30T12:00:00'
    },
    {
      start: '2025-01-30T14:00:00',
      end: '2025-01-30T16:00:00'
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
