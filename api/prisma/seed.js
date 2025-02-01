const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.request.deleteMany()
  await prisma.project.deleteMany()
  await prisma.workbench.deleteMany()
  await prisma.user.deleteMany()

  // Create Users
  const users = await prisma.user.createMany({
    data: [
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'ADMIN',
        status: 'APPROVED'
      },
      {
        name: 'User',
        email: 'user@test.com',
        password: await bcrypt.hash('user123', 10),
        role: 'USER',
        status: 'APPROVED'
      },
      {
        name: 'Maria Souza',
        email: 'maria.souza@example.com',
        password: await bcrypt.hash('maria123', 10),
        role: 'USER',
        status: 'APPROVED'
      },
      {
        name: 'João Silva',
        email: 'joao.silva@example.com',
        password: await bcrypt.hash('joao123', 10),
        role: 'USER',
        status: 'PENDING'
      },
      {
        name: 'Ana Santos',
        email: 'ana.santos@example.com',
        password: await bcrypt.hash('ana123', 10),
        role: 'USER',
        status: 'APPROVED'
      },
      {
        name: 'Pedro Costa',
        email: 'pedro.costa@example.com',
        password: await bcrypt.hash('pedro123', 10),
        role: 'USER',
        status: 'DISABLED'
      },
      {
        name: 'Carla Oliveira',
        email: 'carla.oliveira@example.com',
        password: await bcrypt.hash('carla123', 10),
        role: 'ADMIN',
        status: 'APPROVED'
      },
      {
        name: 'Rafael Pereira',
        email: 'rafael.pereira@example.com',
        password: await bcrypt.hash('rafael123', 10),
        role: 'USER',
        status: 'APPROVED'
      },
      {
        name: 'Juliana Rodrigues',
        email: 'juliana.rodrigues@example.com',
        password: await bcrypt.hash('juliana123', 10),
        role: 'USER',
        status: 'PENDING'
      },
      {
        name: 'Lucas Ferreira',
        email: 'lucas.ferreira@example.com',
        password: await bcrypt.hash('lucas123', 10),
        role: 'USER',
        status: 'APPROVED'
      },
      {
        name: 'Mariana Almeida',
        email: 'mariana.almeida@example.com',
        password: await bcrypt.hash('mariana123', 10),
        role: 'USER',
        status: 'APPROVED'
      }
    ]
  })

  // Fetch created users to get their IDs
  const createdUsers = await prisma.user.findMany()

  // Create Workbenches
  const workbenches = await prisma.workbench.createMany({
    data: [
      {
        name: 'Bancada de Controle de Processos',
        description: 'Bancada para experimentos de controle de processos industriais',
        resources: JSON.stringify([
          'PLC Siemens S7-1200',
          'Sensores de temperatura',
          'Válvulas de controle'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Robótica',
        description: 'Bancada para experimentos e treinamento em robótica',
        resources: JSON.stringify([
          'Braço robótico',
          'Controlador robótico',
          'Sensores de proximidade'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Eletrônica',
        description: 'Bancada para projetos e experimentos em eletrônica',
        resources: JSON.stringify([
          'Osciloscópio',
          'Multímetro',
          'Fonte de alimentação'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'MAINTENANCE'
      },
      {
        name: 'Bancada de Mecânica',
        description: 'Bancada para projetos e experimentos em mecânica',
        resources: JSON.stringify([
          'Torno mecânico',
          'Fresadora',
          'Máquina de corte'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Materiais',
        description: 'Bancada para testes e análise de materiais',
        resources: JSON.stringify([
          'Microscópio',
          'Máquina de tração',
          'Durômetro'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Automação',
        description: 'Bancada para projetos de automação industrial',
        resources: JSON.stringify([
          'CLP',
          'Interface homem-máquina',
          'Sensores industriais'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Telecomunicações',
        description: 'Bancada para experimentos em telecomunicações',
        resources: JSON.stringify([
          'Analisador de espectro',
          'Gerador de sinais',
          'Antenas'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Computação',
        description: 'Bancada para projetos de computação e sistemas embarcados',
        resources: JSON.stringify([
          'Computadores',
          'Placas de desenvolvimento',
          'Kits de prototipagem'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Energias Renováveis',
        description: 'Bancada para estudos de fontes de energia alternativas',
        resources: JSON.stringify([
          'Painéis solares',
          'Aerogerador',
          'Inversores de energia'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'AVAILABLE'
      },
      {
        name: 'Bancada de Química',
        description: 'Bancada para experimentos químicos e análises laboratoriais',
        resources: JSON.stringify([
          'Destilador',
          'Centrífuga',
          'Espectrofotômetro'
        ]),
        restricted: true,
        accessibleRoles: JSON.stringify(['ADMIN', 'USER']),
        status: 'MAINTENANCE'
      }
    ]
  })

  // Fetch created workbenches to get their IDs
  const createdWorkbenches = await prisma.workbench.findMany()

  // Create Projects
  const projects = await prisma.project.createMany({
    data: [
      {
        name: 'Projeto de Controle de Temperatura',
        description: 'Desenvolvimento de sistema de controle de temperatura industrial',
        status: 'ACTIVE',
        userId: createdUsers[1].id,
        workbenchId: createdWorkbenches[0].id
      },
      {
        name: 'Automação de Processos',
        description: 'Implementação de automação em linha de produção',
        status: 'ACTIVE',
        userId: createdUsers[3].id,
        workbenchId: createdWorkbenches[5].id
      },
      {
        name: 'Robótica Educacional',
        description: 'Desenvolvimento de kit robótico para ensino',
        status: 'ACTIVE',
        userId: createdUsers[6].id,
        workbenchId: createdWorkbenches[1].id
      },
      {
        name: 'Sistema de Energia Solar',
        description: 'Projeto de sistema de geração de energia solar',
        status: 'ACTIVE',
        userId: createdUsers[8].id,
        workbenchId: createdWorkbenches[8].id
      },
      {
        name: 'Análise de Materiais Compósitos',
        description: 'Estudo de propriedades de novos materiais compósitos',
        status: 'ACTIVE',
        userId: createdUsers[4].id,
        workbenchId: createdWorkbenches[4].id
      },
      {
        name: 'Sistema de Telecomunicações',
        description: 'Desenvolvimento de sistema de comunicação de baixa latência',
        status: 'ACTIVE',
        userId: createdUsers[2].id,
        workbenchId: createdWorkbenches[6].id
      },
      {
        name: 'Prototipagem de Dispositivo Médico',
        description: 'Criação de protótipo de dispositivo médico inovador',
        status: 'ACTIVE',
        userId: createdUsers[7].id,
        workbenchId: createdWorkbenches[7].id
      },
      {
        name: 'Desenvolvimento de Software Embarcado',
        description: 'Criação de software para sistema embarcado',
        status: 'ACTIVE',
        userId: createdUsers[9].id,
        workbenchId: createdWorkbenches[7].id
      },
      {
        name: 'Análise Química Avançada',
        description: 'Pesquisa de novos métodos de análise química',
        status: 'ACTIVE',
        userId: createdUsers[5].id,
        workbenchId: createdWorkbenches[9].id
      },
      {
        name: 'Projeto de Eletrônica Industrial',
        description: 'Desenvolvimento de circuito de controle industrial',
        status: 'ACTIVE',
        userId: createdUsers[0].id,
        workbenchId: createdWorkbenches[2].id
      }
    ]
  })

  // Create Requests
  const requests = await prisma.request.createMany({
    data: [
      {
        userId: createdUsers[1].id,
        workbenchId: createdWorkbenches[0].id,
        date: new Date('2025-02-25'),
        time: '16:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-01'),
        finalDate: new Date('2025-03-15'),
        comments: 'Necessário para projeto de controle de temperatura'
      },
      {
        userId: createdUsers[3].id,
        workbenchId: createdWorkbenches[5].id,
        date: new Date('2025-02-26'),
        time: '10:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-05'),
        finalDate: new Date('2025-03-20'),
        comments: 'Projeto de automação de processos'
      },
      {
        userId: createdUsers[6].id,
        workbenchId: createdWorkbenches[1].id,
        date: new Date('2025-02-27'),
        time: '14:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-10'),
        finalDate: new Date('2025-03-25'),
        comments: 'Desenvolvimento de robótica educacional'
      },
      {
        userId: createdUsers[8].id,
        workbenchId: createdWorkbenches[8].id,
        date: new Date('2025-02-28'),
        time: '09:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-15'),
        finalDate: new Date('2025-03-30'),
        comments: 'Projeto de sistema de energia solar'
      },
      {
        userId: createdUsers[4].id,
        workbenchId: createdWorkbenches[4].id,
        date: new Date('2025-03-01'),
        time: '11:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-20'),
        finalDate: new Date('2025-04-05'),
        comments: 'Análise de materiais compósitos'
      },
      {
        userId: createdUsers[2].id,
        workbenchId: createdWorkbenches[6].id,
        date: new Date('2025-03-02'),
        time: '15:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-03-25'),
        finalDate: new Date('2025-04-10'),
        comments: 'Sistema de telecomunicações'
      },
      {
        userId: createdUsers[7].id,
        workbenchId: createdWorkbenches[7].id,
        date: new Date('2025-03-03'),
        time: '13:00',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-04-01'),
        finalDate: new Date('2025-04-15'),
        comments: 'Prototipagem de dispositivo médico'
      },
      {
        userId: createdUsers[9].id,
        workbenchId: createdWorkbenches[7].id,
        date: new Date('2025-03-04'),
        time: '10:30',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-04-05'),
        finalDate: new Date('2025-04-20'),
        comments: 'Desenvolvimento de software embarcado'
      },
      {
        userId: createdUsers[5].id,
        workbenchId: createdWorkbenches[9].id,
        date: new Date('2025-03-05'),
        time: '16:30',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-04-10'),
        finalDate: new Date('2025-04-25'),
        comments: 'Análise química avançada'
      },
      {
        userId: createdUsers[0].id,
        workbenchId: createdWorkbenches[2].id,
        date: new Date('2025-03-06'),
        time: '14:30',
        status: 'PENDING',
        type: 'workbench_request',
        initialDate: new Date('2025-04-15'),
        finalDate: new Date('2025-04-30'),
        comments: 'Projeto de eletrônica industrial'
      }
    ]
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
