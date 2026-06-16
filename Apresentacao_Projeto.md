# Apresentacao do Projeto

## Tecnologias Utilizadas

### Backend
- **Node.js**: plataforma principal para execucao do backend.
- **Express.js**: framework para criacao da API REST.
- **MySQL 8**: banco de dados relacional da aplicacao.
- **Prisma**: ORM usado para modelar tabelas, relacoes e migrations.
- **jsonwebtoken**: autenticacao baseada em tokens JWT.
- **bcrypt**: hash e validacao de senhas.
- **dotenv**: gerenciamento de variaveis de ambiente.
- **cors**: acesso do frontend ao backend.

### Frontend
- **React 18**: interface baseada em componentes.
- **Vite 5**: dev server e build.
- **Leaflet + React-Leaflet**: mapas interativos.
- **Lucide React**: icones.
- **Fetch API**: comunicacao com o backend em `services/api.js`.

## Organizacao do Codigo

### Backend
- **prisma/**: schema relacional e migrations MySQL.
- **src/config/**: Prisma Client e conexao com o banco.
- **src/controllers/**: regras das rotas publicas e administrativas.
- **src/middlewares/**: autenticacao JWT e verificacao de admin.
- **src/routes/**: rotas da API.
- **src/scripts/**: bootstrap do administrador inicial.
- **server.js**: ponto de entrada da API.

### Frontend
- **src/components/**: componentes reutilizaveis.
- **src/pages/**: telas principais do app e painel admin.
- **src/pages/perfil/**: subtelas de perfil.
- **src/services/**: integracao com a API.
- **src/styles/**: estilos globais.

## Destaques
- Consulta publica de linhas, horarios e mapa.
- Login de usuario comum e administrador.
- Painel admin web para gerenciar linhas, pontos de rota, horarios, FAQs, notificacoes e usuarios.
- Dados operacionais cadastrados pelo admin, sem seed mockado.
- Docker Compose com MySQL, backend e frontend.
