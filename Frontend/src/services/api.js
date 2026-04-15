const API_URL = "/api";

function getToken() {
  return localStorage.getItem("vambora_token");
}

function headers(auth = false) {
  const h = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }
  return h;
}

// ── Auth ───────────────────────────────────────────────────────────────────────

export async function login(email, senha) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, senha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao fazer login");
  localStorage.setItem("vambora_token", data.token);
  return data;
}

export async function registrar(nome, email, senha, telefone) {
  const res = await fetch(`${API_URL}/auth/registrar`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ nome, email, senha, telefone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao registrar");
  localStorage.setItem("vambora_token", data.token);
  return data;
}

export function logout() {
  localStorage.removeItem("vambora_token");
}

export function estaLogado() {
  return !!getToken();
}

// ── Linhas (mesmas assinaturas que antes) ──────────────────────────────────────

export async function buscarLinhas(tipo = "", busca = "") {
  const params = new URLSearchParams();
  if (tipo)  params.set("tipo", tipo);
  if (busca) params.set("busca", busca);
  const res = await fetch(`${API_URL}/linhas?${params}`);
  return res.json();   // { total, linhas }
}

export async function buscarHorarios(idLinha) {
  const res = await fetch(`${API_URL}/linhas/${idLinha}/horarios`);
  if (!res.ok) throw new Error("Linha não encontrada.");
  return res.json();   // { linha, horarios }
}

export async function buscarEstatisticas() {
  const res = await fetch(`${API_URL}/linhas/estatisticas`);
  return res.json();   // { totalLinhas, tiposModal, tarifaMinima }
}

// ── Perfil ─────────────────────────────────────────────────────────────────────

export async function buscarPerfil() {
  const res = await fetch(`${API_URL}/usuario/perfil`, { headers: headers(true) });
  return res.json();
}

export async function atualizarPerfil(dados) {
  const res = await fetch(`${API_URL}/usuario/perfil`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify(dados),
  });
  return res.json();
}

export async function alterarSenha(senhaAtual, novaSenha) {
  const res = await fetch(`${API_URL}/usuario/senha`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify({ senhaAtual, novaSenha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao alterar senha");
  return data;
}

export async function atualizarEndereco(endereco) {
  const res = await fetch(`${API_URL}/usuario/endereco`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify(endereco),
  });
  return res.json();
}

export async function atualizarPreferencias(prefs) {
  const res = await fetch(`${API_URL}/usuario/preferencias`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify(prefs),
  });
  return res.json();
}

export async function alterarTipoCartao(tipo) {
  const res = await fetch(`${API_URL}/usuario/cartao/tipo`, {
    method: "PUT",
    headers: headers(true),
    body: JSON.stringify({ tipo }),
  });
  return res.json();
}

// ── Saldo e Transações ─────────────────────────────────────────────────────────

export async function buscarSaldo() {
  const res = await fetch(`${API_URL}/usuario/saldo`, { headers: headers(true) });
  return res.json();
}

export async function buscarTransacoes(limite = 10) {
  const res = await fetch(`${API_URL}/usuario/transacoes?limite=${limite}`, {
    headers: headers(true),
  });
  return res.json();
}

// ── Notificações ───────────────────────────────────────────────────────────────

export async function buscarNotificacoes() {
  const res = await fetch(`${API_URL}/usuario/notificacoes`, { headers: headers(true) });
  return res.json();
}

export async function marcarNotificacaoLida(id) {
  const res = await fetch(`${API_URL}/usuario/notificacoes/${id}/lida`, {
    method: "PUT",
    headers: headers(true),
  });
  return res.json();
}

export async function contarNotificacoesNaoLidas() {
  const res = await fetch(`${API_URL}/usuario/notificacoes/nao-lidas/count`, {
    headers: headers(true),
  });
  return res.json();
}

// ── FAQ ────────────────────────────────────────────────────────────────────────

export async function buscarFaqs() {
  const res = await fetch(`${API_URL}/faq`);
  return res.json();
}
