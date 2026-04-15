# 🚌 Vambora Penedo — Frontend

Aplicativo de transporte público da cidade de **Penedo, Alagoas**.  
Permite consultar rotas de ônibus, vans e balsas, visualizar horários, gerenciar saldo do cartão de transporte e receber notificações.

## 🛠 Tecnologias

- **React 18** — Interface de usuário
- **Vite 5** — Build tool / dev server
- **Leaflet + React-Leaflet** — Mapas interativos
- **Lucide React** — Ícones

## 📁 Estrutura do Projeto

```
src/
├── components/       ← Componentes reutilizáveis (BottomNav, Campo, etc.)
├── pages/            ← Páginas/telas do app
│   └── perfil/       ← Sub-telas do perfil do usuário
├── services/         ← Camada de serviços (API)
├── data/             ← Dados mock
├── styles/           ← Estilos globais e variáveis CSS
├── App.jsx           ← Componente raiz / roteamento
└── main.jsx          ← Entry point
```

## 🚀 Como rodar

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## 👥 Equipe

Projeto acadêmico — UFAL (Universidade Federal de Alagoas).
