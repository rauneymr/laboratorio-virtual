import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = (data) => {
    console.log(data)
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Project</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Project Name</FormLabel>
                <Input {...register('name')} />
              </FormControl>
              <FormControl>
                <FormLabel>Camera Host URL</FormLabel>
                <Input {...register('cameraHost')} />
              </FormControl>
              <Button type="submit" colorScheme="blue" w="full">
                Create Project
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default CreateProjectModal
