# RemoteLab API

## Configuração do Projeto

### Pré-requisitos
- Node.js (v16 ou superior)
- MySQL

### Instalação

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```

3. Configure o arquivo `.env` com suas credenciais de banco de dados:
   ```
   DB_PORT=3306
   DB_USERNAME=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=remotelab
   DB_HOST=localhost
   ```

4. Gere o cliente Prisma:
   ```
   npm run prisma:generate
   ```

5. Crie as migrações do banco de dados:
   ```
   npm run prisma:migrate
   ```

### Executando a Aplicação

- Desenvolvimento:
  ```
  npm run dev
  ```

- Produção:
  ```
  npm start
  ```

### Scripts Disponíveis
- `npm run prisma:generate`: Gera o cliente Prisma
- `npm run prisma:migrate`: Cria migrações do banco de dados
- `npm run prisma:studio`: Abre o Prisma Studio para visualizar dados

## Estrutura do Projeto
- `index.js`: Servidor principal da API
- `prisma/schema.prisma`: Definição do esquema do banco de dados
- `.env`: Configurações de ambiente (não commitar)

## Tecnologias
- Express.js
- Prisma ORM
- MySQL
