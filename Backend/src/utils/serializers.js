export function serializarUsuario(usuario) {
  if (!usuario) return null;
  const { senha, ...safe } = usuario;
  return {
    _id: String(safe.id),
    id: safe.id,
    nome: safe.nome,
    email: safe.email,
    telefone: safe.telefone,
    role: safe.role,
    endereco: {
      cep: safe.cep,
      rua: safe.rua,
      numero: safe.numeroEndereco,
      complemento: safe.complemento,
      bairro: safe.bairro,
      cidade: safe.cidade,
      estado: safe.estado,
    },
    preferencias: {
      notificacoesHorarios: safe.notificacoesHorarios,
      alertasTarifa: safe.alertasTarifa,
      newsletter: safe.newsletter,
    },
    cartao: {
      numero: safe.cartaoNumero,
      tipo: fromCartaoTipo(safe.cartaoTipo),
      saldo: Number(safe.saldo || 0),
    },
    motoristaLinhas: (safe.linhasMotorista || []).map((item) => item.linhaId),
    cobradorLinhas: (safe.linhasCobrador || []).map((item) => item.linhaId),
    createdAt: safe.createdAt,
    updatedAt: safe.updatedAt,
  };
}

export function serializarSolicitacaoBeneficio(solicitacao) {
  if (!solicitacao) return null;
  return {
    id: solicitacao.id,
    usuarioId: solicitacao.usuarioId,
    tipoSolicitado: fromCartaoTipo(solicitacao.tipoSolicitado),
    status: solicitacao.status,
    dados: solicitacao.dados,
    observacao: solicitacao.observacao || "",
    respostaAdmin: solicitacao.respostaAdmin || "",
    analisadoEm: solicitacao.analisadoEm,
    createdAt: solicitacao.createdAt,
    updatedAt: solicitacao.updatedAt,
    usuario: solicitacao.usuario ? serializarUsuario(solicitacao.usuario) : null,
  };
}

export function serializarVeiculoLocalizacao(item) {
  return {
    _id: String(item.id),
    id: item.id,
    usuarioId: item.usuarioId,
    motorista: item.usuario?.nome || "Motorista",
    linhaId: item.linhaId,
    linha: item.linha ? serializarLinha(item.linha) : null,
    latitude: Number(item.latitude),
    longitude: Number(item.longitude),
    precisao: item.precisao !== null && item.precisao !== undefined ? Number(item.precisao) : null,
    ativo: item.ativo,
    atualizadoEm: item.atualizadoEm,
  };
}

export function serializarLinha(linha, incluirHorarios = false) {
  if (!linha) return null;
  const base = {
    _id: String(linha.id),
    id: linha.id,
    numero: linha.numero,
    nome: linha.nome,
    tipoTransporte: linha.tipoTransporte,
    tarifa: Number(linha.tarifa),
    infoPagamento: linha.infoPagamento,
    origem: linha.origem,
    destino: linha.destino,
    ativo: linha.ativo,
    rota: (linha.pontos || [])
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => [Number(p.latitude), Number(p.longitude)]),
    paradas: (linha.paradas || [])
      .sort((a, b) => a.ordem - b.ordem)
      .map((p) => ({
        _id: String(p.id),
        id: p.id,
        nome: p.nome,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        ordem: p.ordem,
      })),
    createdAt: linha.createdAt,
    updatedAt: linha.updatedAt,
  };

  if (incluirHorarios) {
    base.horarios = agruparHorarios(linha.horarios || []);
  }

  return base;
}

export function agruparHorarios(horarios) {
  const grupos = { util: [], sabado: [], domingo_feriado: [] };
  horarios
    .slice()
    .sort((a, b) => a.ordem - b.ordem || a.horario.localeCompare(b.horario))
    .forEach((item) => {
      if (grupos[item.tipoDia]) grupos[item.tipoDia].push(item.horario);
    });
  return grupos;
}

export function serializarFaq(faq) {
  return { ...faq, _id: String(faq.id) };
}

export function serializarNotificacao(n) {
  return { ...n, _id: String(n.id) };
}

export function serializarTransacao(t) {
  return { ...t, _id: String(t.id), valor: Number(t.valor) };
}

export function toCartaoTipo(tipo) {
  return { Comum: "COMUM", Estudante: "ESTUDANTE", Idoso: "IDOSO" }[tipo] || tipo;
}

export function fromCartaoTipo(tipo) {
  return { COMUM: "Comum", ESTUDANTE: "Estudante", IDOSO: "Idoso" }[tipo] || tipo;
}
