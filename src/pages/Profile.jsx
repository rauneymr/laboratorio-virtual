import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  SimpleGrid,
  useToast,
  Select,
  Collapse,
  Heading,
  Textarea
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import useAuthStore from '../store/authStore'

const inputStyles = {
  width: 'full',
  borderColor: 'gray.200',
  _hover: {
    borderColor: 'gray.300'
  }
}

const Profile = () => {
  const user = useAuthStore(state => state.user)
  const [academicRole, setAcademicRole] = useState('student')
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: user?.email,
      name: '',
      birthDate: '',
      institution: '',
      academicRole: 'student',
      course: '',
      semester: '',
      studentId: '',
      researchArea: '',
      advisor: '',
      department: '',
      position: '',
      researchLines: '',
      siape: '',
      lattes: '',
      phone: '',
      about: ''
    }
  })
  const toast = useToast()

  const handleRoleChange = (e) => {
    setAcademicRole(e.target.value)
  }

  const onSubmit = (data) => {
    console.log(data)
    toast({
      title: 'Perfil atualizado',
      status: 'success',
      duration: 3000
    })
  }

  return (
    <Box maxW="900px" mx="auto" py={6}>
      <Heading mb={6}>Meu Perfil</Heading>
      
      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={6} align="stretch">
            {/* Campos Básicos */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
              <FormControl>
                <FormLabel>Nome Completo</FormLabel>
                <Input {...register('name')} sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>E-mail</FormLabel>
                <Input {...register('email')} type="email" isReadOnly sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>Data de Nascimento</FormLabel>
                <Input {...register('birthDate')} type="date" sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input {...register('phone')} sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>Instituição de Ensino</FormLabel>
                <Input {...register('institution')} sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>Vínculo Acadêmico</FormLabel>
                <Select {...register('academicRole')} onChange={handleRoleChange} sx={inputStyles}>
                  <option value="student">Estudante</option>
                  <option value="professor">Professor</option>
                  <option value="researcher">Pesquisador</option>
                  <option value="technician">Técnico</option>
                  <option value="other">Outro</option>
                </Select>
              </FormControl>
            </SimpleGrid>

            {/* Campos específicos para Estudantes */}
            <Collapse in={academicRole === 'student'} animateOpacity>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl>
                  <FormLabel>Curso</FormLabel>
                  <Input {...register('course')} sx={inputStyles} />
                </FormControl>

                <FormControl>
                  <FormLabel>Semestre Atual</FormLabel>
                  <Select {...register('semester')} sx={inputStyles}>
                    <option value="">Selecione o semestre</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num}º Semestre</option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Matrícula</FormLabel>
                  <Input {...register('studentId')} sx={inputStyles} />
                </FormControl>

                <FormControl>
                  <FormLabel>Orientador</FormLabel>
                  <Input {...register('advisor')} sx={inputStyles} />
                </FormControl>
              </SimpleGrid>
            </Collapse>

            {/* Campos específicos para Professores */}
            <Collapse in={academicRole === 'professor'} animateOpacity>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl>
                  <FormLabel>Departamento</FormLabel>
                  <Input {...register('department')} sx={inputStyles} />
                </FormControl>

                <FormControl>
                  <FormLabel>Cargo/Posição</FormLabel>
                  <Select {...register('position')} sx={inputStyles}>
                    <option value="assistant">Professor Assistente</option>
                    <option value="adjunct">Professor Adjunto</option>
                    <option value="associate">Professor Associado</option>
                    <option value="full">Professor Titular</option>
                    <option value="substitute">Professor Substituto</option>
                    <option value="visiting">Professor Visitante</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>SIAPE</FormLabel>
                  <Input {...register('siape')} sx={inputStyles} />
                </FormControl>
              </SimpleGrid>
            </Collapse>

            {/* Campos específicos para Pesquisadores */}
            <Collapse in={academicRole === 'researcher'} animateOpacity>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl>
                  <FormLabel>Área de Pesquisa</FormLabel>
                  <Input {...register('researchArea')} sx={inputStyles} />
                </FormControl>

                <FormControl>
                  <FormLabel>Linhas de Pesquisa</FormLabel>
                  <Input {...register('researchLines')} sx={inputStyles} />
                </FormControl>
              </SimpleGrid>
            </Collapse>

            {/* Campos específicos para Técnicos */}
            <Collapse in={academicRole === 'technician'} animateOpacity>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                <FormControl>
                  <FormLabel>Área de Atuação</FormLabel>
                  <Input {...register('technicalArea')} sx={inputStyles} />
                </FormControl>

                <FormControl>
                  <FormLabel>Registro Profissional</FormLabel>
                  <Input {...register('professionalId')} sx={inputStyles} />
                </FormControl>
              </SimpleGrid>
            </Collapse>

            {/* Campos Comuns para todos */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
              <FormControl>
                <FormLabel>Link do Lattes</FormLabel>
                <Input {...register('lattes')} type="url" sx={inputStyles} />
              </FormControl>

              <FormControl>
                <FormLabel>Área de Pesquisa</FormLabel>
                <Input {...register('researchArea')} sx={inputStyles} />
              </FormControl>
            </SimpleGrid>

            <FormControl>
              <FormLabel>Sobre</FormLabel>
              <Textarea
                {...register('about')}
                minH="100px"
                resize="vertical"
                sx={inputStyles}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              w={{ base: 'full', md: 'auto' }}
              alignSelf="flex-end"
            >
              Salvar Alterações
            </Button>
          </VStack>
        </form>
      </Box>
    </Box>
  )
}

export default Profile
