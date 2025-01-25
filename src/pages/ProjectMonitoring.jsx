import {
  Box,
  Grid,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber
} from '@chakra-ui/react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const ProjectMonitoring = () => {
  return (
    <Box>
      <Heading mb={6}>Project Monitoring</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
        <Stat>
          <StatLabel>Temperature</StatLabel>
          <StatNumber>25.6°C</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pressure</StatLabel>
          <StatNumber>1.2 bar</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Flow Rate</StatLabel>
          <StatNumber>2.5 L/min</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Status</StatLabel>
          <StatNumber>Running</StatNumber>
        </Stat>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <Box p={4} borderWidth={1} borderRadius="lg">
          <LineChart width={600} height={300} data={[]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </Box>

        <Box p={4} borderWidth={1} borderRadius="lg">
          {/* Camera Feed Placeholder */}
          <Box bg="gray.200" h="300px" display="flex" alignItems="center" justifyContent="center">
            Camera Feed
          </Box>
        </Box>
      </Grid>
    </Box>
  )
}

export default ProjectMonitoring
