import { SimpleGrid, Button } from '@chakra-ui/react'
import { parseISO, isWithinInterval, addHours } from 'date-fns'

export function TimeSlotPicker({ occupiedSlots, onTimeSelect, selectedDate }) {
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
