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
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import { format, parseISO, isBefore, isAfter, eachDayOfInterval } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Calendar from '../components/Calendar'
import apiData from '../api.json'
import NameSearchFilter from '../components/NameSearchFilter'
import { FaCalendarPlus } from 'react-icons/fa'

// WorkbenchCard Component
const WorkbenchCard = ({ workbench, onSchedule }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('gray.200', 'gray.700')
  const headingColor = useColorModeValue('gray.700', 'gray.200')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box
      p={5}
      borderWidth={1}
      borderRadius="lg"
      shadow="sm"
      _hover={{ shadow: 'md' }}
      bg={cardBg}
      borderColor={cardBorder}
    >
      <Heading size="md" mb={2} color={headingColor}>{workbench.name}</Heading>
      <Text color={textColor} mb={4}>{workbench.description}</Text>
      <Text mb={2}>Recursos:</Text>
      <Box mb={4}>
        {workbench.resources.map((resource, index) => (
          <Text key={index} fontSize="sm" color={textColor}>• {resource}</Text>
        ))}
      </Box>
      <Button colorScheme="blue" onClick={() => onSchedule(workbench)}>
        Agendar
      </Button>
    </Box>
  )
}

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
            <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
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
                <Text fontWeight="bold" color={useColorModeValue('gray.700', 'gray.500')}>
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
  const [searchTerm, setSearchTerm] = useState('')

  const inputBg = useColorModeValue('white', 'gray.700')
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600')
  const inputPlaceholderColor = useColorModeValue('gray.500', 'gray.400')

  const workbenches = useMemo(() => {
    if (!searchTerm) return apiData.workbenches

    return apiData.workbenches.filter(workbench => 
      workbench.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [searchTerm])

  const handleSchedule = (workbench) => {
    setSelectedWorkbench(workbench)
    onOpen()
  }

  return (
    <Box p={2}>
      <Heading mb={6} color={useColorModeValue('gray.700', 'gray.200')}>Agendamento de Bancadas</Heading>
      
      <Flex mb={4} alignItems="center" gap={3}>
        <Box flex={1}>
          <NameSearchFilter
            placeholder="Pesquisar bancada"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg={inputBg}
            borderColor={inputBorderColor}
            placeholderColor={inputPlaceholderColor}
          />
        </Box>
      </Flex>

      {workbenches.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text>Nenhuma bancada encontrada</Text>
        </Box>
      )}

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
