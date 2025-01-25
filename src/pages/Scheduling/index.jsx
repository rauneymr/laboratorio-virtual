import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { useState } from 'react'
import { useDisclosure } from '@chakra-ui/react'
import { WorkbenchCard } from './WorkbenchCard'
import { SchedulingModal } from './SchedulingModal'

export function Scheduling() {
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
