# Vambora Penedo

Sistema web/mobile-first para consulta e administracao de transporte publico em Penedo, Alagoas.

## Estrutura

```txt
Backend/             API Node.js + Express + Prisma + MySQL
Frontend/            React + Vite
docker-compose.yml   Sobe MySQL, API e frontend
.env.example         Template de variaveis de ambiente
```

## Como Rodar com Docker

```bash
docker compose up --build
```

Servicos:

| Servico | URL |
| --- | --- |
| Frontend | http://localhost:5173 |
| Backend | http://localhost:3001 |
| MySQL | localhost:3306 |

Na primeira subida, o backend executa as migrations do Prisma e cria o administrador inicial definido no `.env`.

Admin padrao de desenvolvimento:

| Campo | Valor |
| --- | --- |
| Email | `admin@vambora.local` |
| Senha | `admin123` |

Depois de logar como admin, a aba **Admin** fica disponivel no app para cadastrar, editar e remover linhas, rotas, horarios, FAQs, notificacoes e informacoes basicas de usuarios. Os dados operacionais deixam de ser mockados por seed e passam a ser gerenciados pelo painel.

## Desenvolvimento Local

```bash
# Terminal 1: banco
docker compose up mysql

# Terminal 2: backend
cd Backend
npm install
npx prisma migrate deploy
npm run dev

# Terminal 3: frontend
cd Frontend
npm install
npm run dev
```

Para criar ou atualizar o admin inicial manualmente:

```bash
cd Backend
npm run bootstrap:admin
```

## Variaveis de Ambiente

| Variavel | Padrao | Descricao |
| --- | --- | --- |
| `MYSQL_ROOT_PASSWORD` | `root123` | Senha root do MySQL no Docker |
| `MYSQL_DATABASE` | `vambora_penedo` | Banco da aplicacao |
| `MYSQL_USER` | `vambora` | Usuario da aplicacao |
| `MYSQL_PASSWORD` | `vambora123` | Senha do usuario da aplicacao |
| `DATABASE_URL` | ver `Backend/.env.example` | URL Prisma para conexao MySQL |
| `JWT_SECRET` | `vambora-penedo-secret-key-2025` | Chave para assinar tokens |
| `ADMIN_EMAIL` | `admin@vambora.local` | Email do admin inicial |
| `ADMIN_PASSWORD` | `admin123` | Senha do admin inicial |
| `ADMIN_NAME` | `Administrador` | Nome do admin inicial |

## Principais Endpoints

| Metodo | Rota | Auth | Descricao |
| --- | --- | :---: | --- |
| POST | `/api/auth/login` | Nao | Login |
| POST | `/api/auth/registrar` | Nao | Cadastro |
| GET | `/api/linhas` | Nao | Listar linhas ativas |
| GET | `/api/linhas/:id/horarios` | Nao | Horarios de uma linha |
| GET | `/api/usuario/perfil` | Sim | Perfil do usuario |
| GET | `/api/usuario/saldo` | Sim | Saldo/cartao |
| GET | `/api/faq` | Nao | FAQ publica |
| `/api/admin/*` | Sim/Admin | CRUD administrativo |

## Observacoes

- O banco atual e MySQL 8.
- Prisma gerencia o schema relacional e as migrations.
- O seed mockado foi removido. O bootstrap cria apenas o admin inicial.
