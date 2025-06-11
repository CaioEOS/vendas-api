# 🚀 Gestão de Vendas - MEI API

Sistema completo de gestão de vendas desenvolvido especificamente para Microempreendedores Individuais (MEIs). Uma solução robusta, gratuita e intuitiva para controle financeiro e operacional de pequenos negócios.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso da API](#uso-da-api)
- [Endpoints](#endpoints)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)

## 🎯 Sobre o Projeto

O **Gestão de Vendas - MEI** é uma API REST desenvolvida com NestJS e Prisma que oferece aos Microempreendedores Individuais uma solução completa para:

- ✅ Controle financeiro profissional
- ✅ Registro simplificado de vendas
- ✅ Gestão de produtos e estoque
- ✅ Relatórios detalhados e dashboards
- ✅ Exportação de dados para DAS/PGMEI
- ✅ Análises de performance e tendências

## 🚀 Funcionalidades

### 👤 Gestão de Usuários
- Cadastro e autenticação segura
- Perfil personalizado por MEI
- Sistema de JWT para segurança

### 📦 Gestão de Produtos
- Cadastro completo de produtos
- Categorização inteligente
- Controle de preços e status
- Análise de produtos mais vendidos

### 💰 Gestão de Vendas
- Registro rápido e intuitivo
- Cálculo automático de valores
- Histórico completo de transações
- Filtros por período e produto

### 📊 Relatórios e Analytics
- Dashboard executivo em tempo real
- Comparativos mensais e anuais
- Análise por categoria e produto
- Exportação em JSON e CSV
- Métricas de performance (ticket médio, etc.)

## 🛠 Tecnologias

- **Backend**: NestJS (Node.js + TypeScript)
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: JWT + Passport
- **Validação**: Class Validator + Class Transformer
- **Documentação**: Swagger (em desenvolvimento)

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MySQL (versão 8.0 ou superior)
- pnpm (recomendado) ou npm

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd vendas-api
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure o banco de dados**
```bash
# Crie o banco de dados MySQL
mysql -u root -p
CREATE DATABASE vendas_db;
```

4. **Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas configurações
DATABASE_URL="mysql://usuario:senha@localhost:3306/vendas_db"
JWT_SECRET="seu-jwt-secret-super-seguro"
JWT_EXPIRES_IN="7d"
PORT=3000
```

5. **Execute as migrações do banco**
```bash
pnpm prisma generate
pnpm prisma db push
```

6. **Inicie o servidor**
```bash
# Desenvolvimento
pnpm start:dev

# Produção
pnpm build
pnpm start:prod
```

## ⚙️ Configuração

### Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão MySQL | `mysql://user:pass@localhost:3306/vendas_db` |
| `JWT_SECRET` | Chave secreta para JWT | `minha-chave-super-secreta` |
| `JWT_EXPIRES_IN` | Tempo de expiração do token | `7d` |
| `PORT` | Porta do servidor | `3000` |

### Banco de Dados

O sistema utiliza as seguintes tabelas principais:
- `tb_usuarios` - Dados dos MEIs
- `tb_produtos` - Catálogo de produtos
- `tb_vendas` - Registro de vendas
- `tb_relatorios_mensais` - Cache de relatórios

## 🔌 Uso da API

### Autenticação

Todas as rotas (exceto registro e login) requerem autenticação via Bearer Token:

```bash
Authorization: Bearer <seu-jwt-token>
```

### Exemplo de Uso

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "123456"
  }'

# 3. Criar produto
curl -X POST http://localhost:3000/api/produtos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Camiseta Básica",
    "preco": 29.90,
    "categoria": "Roupas"
  }'

# 4. Registrar venda
curl -X POST http://localhost:3000/api/vendas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": 1,
    "quantidade": 2,
    "dataVenda": "2024-01-15"
  }'
```

## 📚 Endpoints

### 🔐 Autenticação
- `POST /api/auth/register` - Cadastrar usuário
- `POST /api/auth/login` - Fazer login

### 👤 Usuários
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário
- `PATCH /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Excluir usuário

### 📦 Produtos
- `GET /api/produtos` - Listar produtos (paginado)
- `POST /api/produtos` - Criar produto
- `GET /api/produtos/:id` - Buscar produto
- `PATCH /api/produtos/:id` - Atualizar produto
- `DELETE /api/produtos/:id` - Excluir produto
- `GET /api/produtos/categoria/:categoria` - Produtos por categoria
- `GET /api/produtos/mais-vendidos` - Produtos mais vendidos

### 💰 Vendas
- `GET /api/vendas` - Listar vendas (paginado, com filtros)
- `POST /api/vendas` - Registrar venda
- `GET /api/vendas/:id` - Buscar venda
- `PATCH /api/vendas/:id` - Atualizar venda
- `DELETE /api/vendas/:id` - Excluir venda
- `GET /api/vendas/periodo` - Vendas por período
- `GET /api/vendas/resumo-mensal` - Resumo mensal

### 📊 Relatórios
- `GET /api/relatorios/dashboard` - Dashboard principal
- `GET /api/relatorios/comparativo-mensal` - Comparativo mensal
- `GET /api/relatorios/detalhado` - Relatório detalhado
- `GET /api/relatorios/exportar` - Exportar dados (JSON/CSV)

### 🔍 Sistema
- `GET /api` - Informações da API
- `GET /api/health` - Status do sistema

## 📁 Estrutura do Projeto

```
src/
├── auth/                 # Módulo de autenticação
│   ├── dto/             # DTOs de autenticação
│   ├── guards/          # Guards JWT e Local
│   └── strategies/      # Estratégias Passport
├── common/              # Utilitários compartilhados
│   └── dto/            # DTOs comuns (paginação)
├── prisma/             # Configuração Prisma
├── produtos/           # Módulo de produtos
├── relatorios/         # Módulo de relatórios
├── users/              # Módulo de usuários
├── vendas/             # Módulo de vendas
├── app.module.ts       # Módulo principal
└── main.ts            # Ponto de entrada
```

## 🎨 Padrões de Código

- **Arquitetura**: Modular (NestJS)
- **Validação**: DTOs com decorators
- **Segurança**: JWT + Guards
- **Banco**: Prisma ORM com relacionamentos
- **Tratamento de Erros**: Exception Filters
- **Documentação**: JSDoc + README

## 🚀 Deploy

### Docker (Recomendado)

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Variáveis de Produção

```bash
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:3306/db
JWT_SECRET=chave-super-segura-producao
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para ajudar MEIs a crescerem seus negócios.

---

**🎯 Objetivo**: Democratizar o acesso a ferramentas de gestão profissional para pequenos empreendedores brasileiros.

**📞 Suporte**: Abra uma issue no GitHub para reportar bugs ou solicitar funcionalidades.
