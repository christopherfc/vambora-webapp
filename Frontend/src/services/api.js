const API_URL = import.meta.env.VITE_API_URL || "/api";

function getToken() {
  return localStorage.getItem("vambora_token");
}

function setUsuario(usuario) {
  localStorage.setItem("vambora_usuario", JSON.stringify(usuario));
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
  setUsuario(data.usuario);
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
  setUsuario(data.usuario);
  return data;
}

export function logout() {
  localStorage.removeItem("vambora_token");
  localStorage.removeItem("vambora_usuario");
}

export function estaLogado() {
  return !!getToken();
}

export function usuarioAtual() {
  try {
    return JSON.parse(localStorage.getItem("vambora_usuario") || "null");
  } catch {
    return null;
  }
}

async function requestAdmin(path, options = {}) {
  const res = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: { ...headers(true), ...(options.headers || {}) },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro no painel admin");
  return data;
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

export async function buscarVeiculosAtivos() {
  const res = await fetch(`${API_URL}/linhas/veiculos-ativos`);
  return res.json();
}

export async function motoristaListarLinhas() {
  const res = await fetch(`${API_URL}/motorista/linhas`, { headers: headers(true) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao buscar linhas do motorista");
  return data;
}

export async function motoristaAtualizarLocalizacao(dados) {
  const res = await fetch(`${API_URL}/motorista/localizacao`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(dados),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao atualizar localizacao");
  return data;
}

export async function motoristaParar() {
  const res = await fetch(`${API_URL}/motorista/parar`, {
    method: "POST",
    headers: headers(true),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao parar compartilhamento");
  return data;
}

export async function cobradorListarLinhas() {
  const res = await fetch(`${API_URL}/cobrador/linhas`, { headers: headers(true) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao buscar linhas do cobrador");
  return data;
}

export async function cobradorCobrar(dados) {
  const res = await fetch(`${API_URL}/cobrador/cobrar`, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(dados),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.mensagem || "Erro ao cobrar passagem");
  return data;
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
  if (!res.ok) throw new Error("Erro ao buscar saldo");
  return res.json();
}

export async function buscarTransacoes(limite = 10) {
  const res = await fetch(`${API_URL}/usuario/transacoes?limite=${limite}`, {
    headers: headers(true),
  });
  if (!res.ok) throw new Error("Erro ao buscar transações");
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

// Admin
export const adminResumo = () => requestAdmin("/resumo");
export const adminListarLinhas = () => requestAdmin("/linhas");
export const adminCriarLinha = (linha) => requestAdmin("/linhas", { method: "POST", body: JSON.stringify(linha) });
export const adminAtualizarLinha = (id, linha) => requestAdmin(`/linhas/${id}`, { method: "PUT", body: JSON.stringify(linha) });
export const adminRemoverLinha = (id) => requestAdmin(`/linhas/${id}`, { method: "DELETE" });
export const adminListarFaqs = () => requestAdmin("/faqs");
export const adminSalvarFaq = (faq) => {
  const id = faq.id || faq._id;
  return requestAdmin(id ? `/faqs/${id}` : "/faqs", { method: id ? "PUT" : "POST", body: JSON.stringify(faq) });
};
export const adminRemoverFaq = (id) => requestAdmin(`/faqs/${id}`, { method: "DELETE" });
export const adminListarNotificacoes = () => requestAdmin("/notificacoes");
export const adminSalvarNotificacao = (notificacao) => {
  const id = notificacao.id || notificacao._id;
  return requestAdmin(id ? `/notificacoes/${id}` : "/notificacoes", { method: id ? "PUT" : "POST", body: JSON.stringify(notificacao) });
};
export const adminRemoverNotificacao = (id) => requestAdmin(`/notificacoes/${id}`, { method: "DELETE" });
export const adminListarUsuarios = () => requestAdmin("/usuarios");
export const adminAtualizarUsuario = (id, usuario) => requestAdmin(`/usuarios/${id}`, { method: "PUT", body: JSON.stringify(usuario) });
export const adminListarRegrasCobranca = () => requestAdmin("/regras-cobranca");
export const adminSalvarRegraCobranca = (regra) => requestAdmin("/regras-cobranca", { method: "PUT", body: JSON.stringify(regra) });
