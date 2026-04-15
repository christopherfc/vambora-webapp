# 🚌 Vambora Penedo

> Sistema de transporte público de Penedo, Alagoas.

---

## 📁 Estrutura

```
├── Backend/             # API Node.js + Express + MongoDB
├── Frontend/            # React + Vite (mobile-first)
├── docker-compose.yml   # Sobe tudo com um comando
├── .env.example         # Template de variáveis de ambiente
└── README.md
```

---

## ⚙️ Instalação do Docker

Você precisa do **Docker Desktop** instalado. Ele já inclui o Docker Compose.

| Sistema  | Link de Download |
|----------|-----------------|
| Windows  | [Docker Desktop para Windows](https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe) |
| macOS    | [Docker Desktop para macOS](https://docs.docker.com/desktop/install/mac-install/) |
| Linux    | [Docker Engine para Linux](https://docs.docker.com/engine/install/) |

Após instalar, verifique se está funcionando:

```bash
docker --version
docker compose version
```

---

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/vambora-penedo.git
cd vambora-penedo
```

### 2. Suba todos os serviços

```bash
docker compose up --build
```

Pronto! Aguarde o build terminar e acesse:

| Serviço    | URL                        |
|------------|----------------------------|
| **Frontend**   | http://localhost:5173   |
| **Backend**    | http://localhost:3001   |
| **MongoDB**    | localhost:27017         |

### 3. Popular o banco com dados de exemplo (seed)

Em **outro terminal**, rode:

```bash
docker compose --profile seed up seed
```

Isso cria um usuário de teste e dados mockados:

| Campo | Valor |
|-------|-------|
| Email | `joao@email.com` |
| Senha | `123456` |

> Se quiser rodar o seed novamente, ele limpa os dados antigos antes de inserir novos.

### 4. Parar os serviços

```bash
docker compose down
```

Para parar **e apagar os dados do banco**:

```bash
docker compose down -v
```

---

## 🛠️ Desenvolvimento Local (sem Docker)

Se preferir rodar apenas o MongoDB no Docker e o resto local:

```bash
# Terminal 1 — Banco
docker compose up mongodb

# Terminal 2 — Backend
cd Backend
npm install
npm run dev

# Terminal 3 — Frontend
cd Frontend
npm install
npm run dev

# Seed (local)
cd Backend
npm run seed
```

---

## 🔑 Variáveis de Ambiente

| Variável         | Padrão                           | Descrição                 |
|------------------|----------------------------------|---------------------------|
| `MONGO_USER`     | `admin`                          | Usuário root do MongoDB   |
| `MONGO_PASSWORD` | `admin123`                       | Senha root do MongoDB     |
| `JWT_SECRET`     | `vambora-penedo-secret-key-2025` | Chave para assinar tokens |
| `NODE_ENV`       | `development`                    | Ambiente da aplicação     |

---

## 📌 Endpoints da API

| Método | Rota                                 | Auth | Descrição             |
|--------|--------------------------------------|:----:|-----------------------|
| POST   | `/api/auth/login`                   | ❌   | Login                 |
| POST   | `/api/auth/registrar`               | ❌   | Cadastro              |
| GET    | `/api/linhas`                       | ❌   | Listar linhas         |
| GET    | `/api/linhas/:id/horarios`          | ❌   | Horários de uma linha |
| GET    | `/api/linhas/estatisticas`          | ❌   | Estatísticas          |
| GET    | `/api/usuario/perfil`               | ✅   | Perfil do usuário     |
| PUT    | `/api/usuario/perfil`               | ✅   | Atualizar perfil      |
| GET    | `/api/usuario/saldo`                | ✅   | Consultar saldo       |
| GET    | `/api/usuario/notificacoes`         | ✅   | Notificações          |
| GET    | `/api/faq`                          | ❌   | FAQ                   |

---

## 👥 Equipe

Projeto desenvolvido para a UFAL — Universidade Federal de Alagoas.
