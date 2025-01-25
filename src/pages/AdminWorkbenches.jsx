import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useToast,
  HStack
} from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useState } from 'react'

const WorkbenchModal = ({ isOpen, onClose, workbench = null }) => {
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    toast({
      title: workbench ? 'Bancada atualizada' : 'Bancada cadastrada',
      status: 'success',
      duration: 2000
    })
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {workbench ? 'Editar Bancada' : 'Nova Bancada'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome da Bancada</FormLabel>
                <Input
                  placeholder="Nome da bancada"
                  defaultValue={workbench?.name}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  placeholder="Descrição da bancada"
                  defaultValue={workbench?.description}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Recursos (um por linha)</FormLabel>
                <Textarea
                  placeholder="Lista de recursos"
                  defaultValue={workbench?.resources?.join('\n')}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" w="full">
                {workbench ? 'Atualizar' : 'Cadastrar'}
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

const AdminWorkbenches = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedWorkbench, setSelectedWorkbench] = useState(null)
  const toast = useToast()

  // Dados de exemplo
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

  const handleEdit = (workbench) => {
    setSelectedWorkbench(workbench)
    onOpen()
  }

  const handleDelete = (id) => {
    toast({
      title: 'Bancada removida',
      status: 'success',
      duration: 2000
    })
  }

  const handleAdd = () => {
    setSelectedWorkbench(null)
    onOpen()
  }

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading>Gerenciar Bancadas</Heading>
        <Button colorScheme="blue" onClick={handleAdd}>
          Nova Bancada
        </Button>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>Descrição</Th>
            <Th>Recursos</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {workbenches.map((workbench) => (
            <Tr key={workbench.id}>
              <Td>{workbench.name}</Td>
              <Td>{workbench.description}</Td>
              <Td>{workbench.resources.length} recursos</Td>
              <Td>
                <HStack spacing={2}>
                  <IconButton
                    icon={<FiEdit2 />}
                    onClick={() => handleEdit(workbench)}
                    aria-label="Editar"
                    size="sm"
                  />
                  <IconButton
                    icon={<FiTrash2 />}
                    onClick={() => handleDelete(workbench.id)}
                    aria-label="Remover"
                    size="sm"
                    colorScheme="red"
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <WorkbenchModal
        isOpen={isOpen}
        onClose={onClose}
        workbench={selectedWorkbench}
      />
    </Box>
  )
}

export default AdminWorkbenches
