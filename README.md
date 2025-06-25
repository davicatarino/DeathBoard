# DeathBoard - Sistema de Ranking de Vendas

Sistema completo para gerenciamento de equipes de vendas, incluindo vendedores, SDRs, reuniões e ranking de performance.

## 🚀 Funcionalidades

- **Gestão de Vendedores**: Cadastro, edição e desativação de vendedores
- **Gestão de SDRs**: Controle de Sales Development Representatives
- **Gestão de Vendas**: Registro e acompanhamento de vendas
- **Gestão de Reuniões**: Agendamento e controle de reuniões com clientes
- **Ranking de Performance**: Rankings de vendedores e SDRs com filtros por período
- **Interface Responsiva**: Design moderno e adaptável para mobile

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: MySQL 8.0
- **Deploy**: Docker & Docker Compose
- **Notificações**: React Hot Toast

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- MySQL (se não usar Docker)

## 🚀 Instalação

### Opção 1: Docker (Recomendado)

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd DeathBoard
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

3. Execute com Docker Compose:
```bash
docker-compose up -d
```

4. Acesse a aplicação:
```
http://localhost:3001
```

### Opção 2: Desenvolvimento Local

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd DeathBoard
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados MySQL e as variáveis de ambiente

4. Execute em modo desenvolvimento:
```bash
npm run dev
```

5. Acesse a aplicação:
```
http://localhost:3000
```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha
MYSQL_DATABASE=deathboard

# Ambiente
NODE_ENV=development
```

### Estrutura do Banco de Dados

O sistema criará automaticamente as tabelas necessárias:

- `Vendedores`: Informações dos vendedores
- `SDRs`: Sales Development Representatives
- `Vendas`: Registro de vendas
- `Reunioes`: Agendamento de reuniões

## 📱 Uso

1. **Home**: Visão geral e navegação para todas as funcionalidades
2. **Vendedores**: Gerencie sua equipe de vendas
3. **SDRs**: Controle os Sales Development Representatives
4. **Vendas**: Registre e acompanhe vendas
5. **Reuniões**: Agende e gerencie reuniões com clientes
6. **Ranking**: Visualize rankings de performance com filtros

## 🔄 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## 🐳 Docker

### Build da imagem:
```bash
docker build -t deathboard .
```

### Executar container:
```bash
docker run -p 3001:3001 deathboard
```

## 📊 Melhorias Implementadas

- ✅ Padronização das APIs
- ✅ Tema escuro consistente
- ✅ Menu mobile funcional
- ✅ Tratamento de erros melhorado
- ✅ Notificações com toast
- ✅ Loading states consistentes
- ✅ Configuração de banco otimizada
- ✅ Docker Compose melhorado

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no GitHub.
