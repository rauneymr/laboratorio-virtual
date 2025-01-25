import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  SimpleGrid,
  useToast
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

const ProjectConfig = () => {
  const { register, handleSubmit } = useForm()
  const toast = useToast()

  const onSubmit = (data) => {
    toast({
      title: 'Configuration saved',
      status: 'success',
      duration: 2000
    })
  }

  return (
    <Box>
      <Heading mb={6}>Project Configuration</Heading>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={6} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <FormControl>
              <FormLabel>Project Name</FormLabel>
              <Input {...register('name')} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Camera Host URL</FormLabel>
              <Input {...register('cameraHost')} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Sample Rate (ms)</FormLabel>
              <Input type="number" {...register('sampleRate')} />
            </FormControl>
            
            <FormControl>
              <FormLabel>Control Protocol</FormLabel>
              <Input {...register('protocol')} />
            </FormControl>
          </SimpleGrid>

          <Button type="submit" colorScheme="blue">
            Save Configuration
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default ProjectConfig
