import {
  Box,
  Button,
  Grid,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  startOfDay,
  isValid,
  min,
  max
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

const Calendar = ({ 
  occupiedDates = [], 
  pendingDates = [],
  onSelectDate, 
  selectedStartDate, 
  selectedEndDate 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const isDateFullyBooked = (date) => {
    return occupiedDates.some(slot => {
      const slotDate = parseISO(slot.start)
      return slotDate.toDateString() === date.toDateString()
    })
  }

  const isDatePending = (date) => {
    return pendingDates.some(slot => {
      const slotDate = parseISO(slot.start)
      return slotDate.toDateString() === date.toDateString()
    })
  }

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false
    const start = parseISO(selectedStartDate)
    const end = parseISO(selectedEndDate)
    return isWithinInterval(date, { start, end })
  }

  const isDateSelectable = (date) => {
    // If no start date is selected, allow selection of non-booked dates
    if (!selectedStartDate) {
      return !isDateFullyBooked(date) && date >= startOfDay(new Date())
    }

    // If start date is selected, check the entire range
    const startDate = parseISO(selectedStartDate)
    const endDate = date

    // Validate dates
    if (!isValid(startDate) || !isValid(endDate)) {
      return false
    }

    // Ensure dates are valid and in correct order
    const minDate = min([startDate, endDate])
    const maxDate = max([startDate, endDate])

    // Check if any date in the range is fully booked
    const dateRange = eachDayOfInterval({ start: minDate, end: maxDate })
    return !dateRange.some(d => isDateFullyBooked(d))
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <VStack spacing={4} w="full">
      <Box borderWidth={1} borderRadius="lg" p={4} borderColor={borderColor} w="full">
        <VStack spacing={4}>
          <HStack justify="space-between" w="full">
            <Button size="sm" onClick={handlePrevMonth}>&lt;</Button>
            <Text fontWeight="bold">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </Text>
            <Button size="sm" onClick={handleNextMonth}>&gt;</Button>
          </HStack>

          <Grid templateColumns="repeat(7, 1fr)" gap={1} w="full">
            {weekDays.map(day => (
              <Box
                key={day}
                textAlign="center"
                fontWeight="bold"
                fontSize="sm"
                py={1}
              >
                {day}
              </Box>
            ))}

            {days.map(day => {
              const isFullyBooked = isDateFullyBooked(day)
              const isPending = isDatePending(day)
              const isInRange = isDateInRange(day)
              const isStart = selectedStartDate && isSameDay(parseISO(selectedStartDate), day)
              const isEnd = selectedEndDate && isSameDay(parseISO(selectedEndDate), day)
              const isSelectable = isDateSelectable(day)
              
              return (
                <Button
                  key={day.toString()}
                  size="sm"
                  variant="outline"
                  onClick={() => isSelectable && onSelectDate(format(day, 'yyyy-MM-dd'))}
                  isDisabled={!isSameMonth(day, currentDate) || day < startOfDay(new Date()) || !isSelectable}
                  bg={
                    isFullyBooked ? 'red.100' :
                    isPending ? 'yellow.100' :
                    isInRange ? 'blue.50' :
                    'white'
                  }
                  borderColor={isStart || isEnd ? 'blue.500' : borderColor}
                  borderWidth={isStart || isEnd ? 2 : 1}
                  _hover={{
                    bg: isFullyBooked ? 'red.200' :
                        isPending ? 'yellow.200' :
                        'gray.100'
                  }}
                  cursor={!isSelectable ? 'not-allowed' : 'pointer'}
                >
                  {format(day, 'd')}
                </Button>
              )
            })}
          </Grid>
        </VStack>
      </Box>
      
      <Flex w="full" justifyContent="center" alignItems="center" gap={4}>
        <Flex alignItems="center" gap={2}>
          <Box w={4} h={4} bg="red.100" borderRadius="full" />
          <Text fontSize="sm">Dias Ocupados</Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Box w={4} h={4} bg="yellow.100" borderRadius="full" />
          <Text fontSize="sm">Dias Pendentes</Text>
        </Flex>
      </Flex>
    </VStack>
  )
}

export default Calendar
