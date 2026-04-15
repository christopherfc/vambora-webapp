# 📋 Análise dos Requisitos Funcionais — Projeto vambora-penedo

## 1. Consulta de Linhas e Horários (Transporte Público Intermodal)
- **RF1.1 — Consultar lista completa de linhas:** Pronto
  - O sistema permite consultar a lista completa de linhas (ônibus, vans, barcos/balsas). Backend e frontend implementam rotas e funções para isso.
- **RF1.2 — Exibir tabela de horários por linha:** Pronto
  - Para cada linha, exibe tabela de horários de partida e chegada, diferenciando dias úteis, sábados e domingos/feriados.
- **RF1.3 — Buscar por nome/número/destino:** Pronto
  - Permite consulta por nome da linha, número ou destino/trajeto.

## 2. Mapa Interativo e Geolocalização
- **RF2.1 — Exibir mapa interativo de Penedo:** Parcialmente Pronto
  - O sistema exibe um mapa interativo da área de Penedo (Leaflet). Não há recursos avançados de geolocalização.
- **RF2.2 — Exibir todos os pontos de parada:** Parcialmente Pronto
  - O mapa mostra o ponto inicial de cada linha, mas não plota todos os pontos de parada (embarque/desembarque/terminais).
- **RF2.3 — Visualizar rota completa da linha:** Parcialmente Pronto
  - O usuário pode visualizar a rota completa (Polyline), mas depende da riqueza dos dados cadastrados.

## 3. Informações de Preços e Pagamento
- **RF3.1 — Informar preços/tarifas dos transportes:** Pronto
  - O sistema fornece informações de tarifas por linha/modal. Endpoint e função buscarEstatisticas retornam tarifas.
- **RF3.2 — Listar formas de pagamento aceitas:** Pronto
- **RF3.3 — Reserva/pagamento de passagens no app:** Não Implementado
  - Não há integração com serviço de reserva ou pagamento de passagens.

## 4. Notificações e Alertas
- **RF4.1 — Notificar atrasos nas linhas:** Parcialmente Pronto
  - O sistema possui notificações, mas não há lógica específica para atrasos.
- **RF4.2 — Alertar mudanças de horários/rotas:** Parcialmente Pronto
  - Notificações podem ser usadas para mudanças de horários/rotas, mas não há lógica dedicada.
- **RF4.3 — Alertar eventos detectados (ônibus chegando, etc):** Não Implementado
  - Não há alertas personalizados do tipo "seu ônibus está chegando" ou "chegando ao destino".

## 5. Personalização e Conta de Usuário
- **RF5.1 — Cadastro e login de usuário:** Pronto
  - Permite cadastro e login de usuário.
- **RF5.2 — Salvar rotas/paradas/linhas favoritas:** Não Implementado
  - Não há função para salvar rotas, paradas ou linhas favoritas/frequentemente usadas.

## 6. Feedback e Engajamento Comunitário
- **RF6.1 — Canal de feedback acessível:** Não Implementado
  - Não há canal de feedback acessível (formulário ou seção dedicada).
- **RF6.2 — Relatar problemas operacionais ou falhas:** Não Implementado
  - Não há canal para relatar problemas operacionais ou falhas no app.
- **RF6.3 — Enviar sugestões de melhoria:** Não Implementado
  - Não há canal para envio de sugestões de melhoria.

---

## Resumo Geral

| Requisito                    | Status               | Observação |
|------------------------------|----------------------|------------|
| Consulta de Linhas/Horários  | Pronto               | Completo   |
| Mapa/Geolocalização          | Parcialmente Pronto  | Mostra mapa, rota e ponto inicial |
| Preços/Pagamento             | Parcialmente Pronto  | Mostra tarifa, mas não formas de pagamento detalhadas |
| Notificações                 | Parcialmente Pronto  | Notificações genéricas, não específicas para atrasos/mudanças |
| Conta do Usuário             | Parcialmente Pronto  | Não há favoritos |
| Feedback/Engajamento         | Não Implementado     | Ausente    |

---

> Caso queira detalhes sobre algum requisito específico, solicite uma análise aprofundada.