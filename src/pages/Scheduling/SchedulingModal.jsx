import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  useToast,
  Text,
  Button
} from '@chakra-ui/react'
import { useState } from 'react'
import { format, parseISO, isBefore, eachDayOfInterval, min, max } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from '../../components/Calendar'

export function SchedulingModal({ isOpen, onClose, workbench }) {
  const toast = useToast()
  const [selectedStartDate, setSelectedStartDate] = useState(null)
  const [selectedEndDate, setSelectedEndDate] = useState(null)

  const occupiedSlots = [
    {
      // Dia 28 totalmente ocupado explicitamente
      start: '2025-01-28T00:00:00',
      end: '2025-01-28T23:59:59'
    },
    {
      // Dia 29 totalmente ocupado 
      start: '2025-01-29T00:00:00',
      end: '2025-01-29T23:59:59'
    },
    {
      // Dia 30 totalmente ocupado
      start: '2025-01-30T00:00:00',
      end: '2025-01-30T23:59:59'
    }
  ]

  const isDateFullyBooked = (date) => {
    return occupiedSlots.some(slot => {
      const slotStart = parseISO(slot.start)
      const slotEnd = parseISO(slot.end)
      return (
        slotStart.toDateString() === date.toDateString() &&
        slot.start.includes('T00:00:00') && 
        slot.end.includes('T23:59:59')
      )
    })
  }

  const isDateRangeAvailable = (startDate, endDate) => {
    const minDate = min([parseISO(startDate), parseISO(endDate)])
    const maxDate = max([parseISO(startDate), parseISO(endDate)])
    
    const dateRange = eachDayOfInterval({ start: minDate, end: maxDate })
    return !dateRange.some(date => isDateFullyBooked(date))
  }

  const handleDateSelect = (date) => {
    if (!selectedStartDate) {
      // First date selection
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    } else {
      // Second date selection
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

      // Check if any date in the range is fully booked
      if (!isDateRangeAvailable(selectedStartDate, date)) {
        toast({
          title: 'Período indisponível',
          description: 'Algumas datas selecionadas já estão ocupadas.',
          status: 'error',
          duration: 3000
        })
        return
      }

      setSelectedEndDate(date)
    }
  }

  const resetSelection = () => {
    setSelectedStartDate(null)
    setSelectedEndDate(null)
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
              <Calendar
                occupiedDates={occupiedSlots}
                onSelectDate={handleDateSelect}
                selectedStartDate={selectedStartDate}
                selectedEndDate={selectedEndDate}
              />

              {selectedStartDate && selectedEndDate && (
                <Text fontWeight="bold" color="gray.700">
                  {formatSelectedPeriod()}
                </Text>
              )}

              <Button 
                colorScheme="blue" 
                type="submit" 
                isDisabled={!selectedStartDate || !selectedEndDate}
              >
                Solicitar Agendamento
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
