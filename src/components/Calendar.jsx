import {
  Box,
  Button,
  Grid,
  Text,
  VStack,
  HStack,
  useColorModeValue
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
  endOfDay,
  setHours,
  setMinutes,
  setSeconds
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'

const Calendar = ({ occupiedDates, onSelectDate, selectedStartDate, selectedEndDate }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  const startDate = startOfMonth(currentDate)
  const endDate = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getOccupiedHoursForDate = (date) => {
    const occupiedHours = new Set()
    
    occupiedDates.forEach(slot => {
      const start = parseISO(slot.start)
      const end = parseISO(slot.end)
      
      if (isSameDay(date, start) || isSameDay(date, end)) {
        let currentHour = start.getHours()
        while (currentHour <= end.getHours()) {
          occupiedHours.add(currentHour)
          currentHour++
        }
      }
    })
    
    return occupiedHours
  }

  const isDateFullyBooked = (date) => {
    // Verifica se há algum slot que ocupa o dia todo
    const hasFullDaySlot = occupiedDates.some(slot => {
      const start = parseISO(slot.start)
      const end = parseISO(slot.end)
      return isSameDay(date, start) && 
             slot.start.includes('T00:00:00') && 
             slot.end.includes('T23:59:59')
    })

    if (hasFullDaySlot) return true

    // Verifica se todos os horários iniciais do dia estão ocupados
    const occupiedHours = getOccupiedHoursForDate(date)
    const businessHours = Array.from({ length: 12 }, (_, i) => i + 8) // 8h às 19h
    return businessHours.every(hour => occupiedHours.has(hour))
  }

  const isDatePartiallyBooked = (date) => {
    if (isDateFullyBooked(date)) return false

    // Verifica se há algum horário ocupado no dia
    const occupiedHours = getOccupiedHoursForDate(date)
    return occupiedHours.size > 0
  }

  const isDateInRange = (date) => {
    if (!selectedStartDate || !selectedEndDate) return false
    const start = parseISO(selectedStartDate)
    const end = parseISO(selectedEndDate)
    return isWithinInterval(date, { start, end })
  }

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <Box borderWidth={1} borderRadius="lg" p={4} borderColor={borderColor}>
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
            const isPartial = isDatePartiallyBooked(day)
            const isInRange = isDateInRange(day)
            const isStart = selectedStartDate && isSameDay(parseISO(selectedStartDate), day)
            const isEnd = selectedEndDate && isSameDay(parseISO(selectedEndDate), day)
            
            return (
              <Button
                key={day.toString()}
                size="sm"
                variant="outline"
                onClick={() => !isFullyBooked && onSelectDate(format(day, 'yyyy-MM-dd'))}
                isDisabled={!isSameMonth(day, currentDate) || day < new Date() || isFullyBooked}
                bg={
                  isFullyBooked ? 'red.100' :
                  isPartial ? 'yellow.100' :
                  isInRange ? 'blue.50' :
                  'white'
                }
                borderColor={isStart || isEnd ? 'blue.500' : borderColor}
                borderWidth={isStart || isEnd ? 2 : 1}
                _hover={{
                  bg: isFullyBooked ? 'red.200' :
                      isPartial ? 'yellow.200' :
                      'gray.100'
                }}
                cursor={isFullyBooked ? 'not-allowed' : 'pointer'}
              >
                {format(day, 'd')}
              </Button>
            )
          })}
        </Grid>
      </VStack>
    </Box>
  )
}

export default Calendar
