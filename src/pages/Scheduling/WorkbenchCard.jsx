import { Box, Heading, Text, Button } from '@chakra-ui/react'

export function WorkbenchCard({ workbench, onSchedule }) {
  return (
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
}
