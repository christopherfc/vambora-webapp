import prisma from "../config/prisma.js";
import {
  agruparHorarios,
  serializarFaq,
  serializarLinha,
  serializarNotificacao,
  serializarUsuario,
} from "../utils/serializers.js";

const TIPOS_DIA = ["util", "sabado", "domingo_feriado"];

function montarPontos(rota = []) {
  return rota
    .filter((p) => Array.isArray(p) && p.length >= 2)
    .map((p, index) => ({
      ordem: index,
      latitude: Number(p[0]),
      longitude: Number(p[1]),
    }))
    .filter((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude));
}

function montarHorarios(horarios = {}) {
  return TIPOS_DIA.flatMap((tipoDia) =>
    (horarios[tipoDia] || [])
      .filter(Boolean)
      .map((horario, index) => ({ tipoDia, horario, ordem: index }))
  );
}

function montarParadas(paradas = []) {
  return paradas
    .filter((p) => p && Number.isFinite(Number(p.latitude)) && Number.isFinite(Number(p.longitude)))
    .map((p, index) => ({
      ordem: index,
      nome: p.nome?.trim() || `Parada ${index + 1}`,
      latitude: Number(p.latitude),
      longitude: Number(p.longitude),
    }));
}

function dadosLinha(body) {
  return {
    numero: Number(body.numero),
    nome: body.nome,
    tipoTransporte: body.tipoTransporte,
    tarifa: Number(body.tarifa),
    infoPagamento: body.infoPagamento,
    origem: body.origem,
    destino: body.destino,
    ativo: body.ativo !== undefined ? Boolean(body.ativo) : true,
  };
}

export const resumo = async (req, res) => {
  try {
    const [usuarios, linhas, faqs, notificacoes] = await Promise.all([
      prisma.user.count(),
      prisma.linha.count(),
      prisma.faq.count(),
      prisma.notificacao.count(),
    ]);

    res.json({ usuarios, linhas, faqs, notificacoes });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao carregar resumo administrativo" });
  }
};

export const listarLinhasAdmin = async (req, res) => {
  try {
    const linhas = await prisma.linha.findMany({
      include: { pontos: true, paradas: true, horarios: true },
      orderBy: { numero: "asc" },
    });
    res.json({ linhas: linhas.map((linha) => serializarLinha(linha, true)) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar linhas" });
  }
};

export const criarLinhaAdmin = async (req, res) => {
  try {
    const pontos = montarPontos(req.body.rota);
    const paradas = montarParadas(req.body.paradas);
    const horarios = montarHorarios(req.body.horarios);

    const linha = await prisma.linha.create({
      data: {
        ...dadosLinha(req.body),
        pontos: { create: pontos },
        paradas: { create: paradas },
        horarios: { create: horarios },
      },
      include: { pontos: true, paradas: true, horarios: true },
    });

    res.status(201).json({ linha: serializarLinha(linha, true) });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao criar linha" });
  }
};

export const atualizarLinhaAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pontos = montarPontos(req.body.rota);
    const paradas = montarParadas(req.body.paradas);
    const horarios = montarHorarios(req.body.horarios);

    const linha = await prisma.$transaction(async (tx) => {
      await tx.rotaPonto.deleteMany({ where: { linhaId: id } });
      await tx.linhaParada.deleteMany({ where: { linhaId: id } });
      await tx.horario.deleteMany({ where: { linhaId: id } });
      await tx.linha.update({ where: { id }, data: dadosLinha(req.body) });
      if (pontos.length) {
        await tx.rotaPonto.createMany({ data: pontos.map((p) => ({ ...p, linhaId: id })) });
      }
      if (paradas.length) {
        await tx.linhaParada.createMany({ data: paradas.map((p) => ({ ...p, linhaId: id })) });
      }
      if (horarios.length) {
        await tx.horario.createMany({ data: horarios.map((h) => ({ ...h, linhaId: id })) });
      }
      return tx.linha.findUnique({ where: { id }, include: { pontos: true, paradas: true, horarios: true } });
    });

    res.json({ linha: serializarLinha(linha, true) });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao atualizar linha" });
  }
};

export const removerLinhaAdmin = async (req, res) => {
  try {
    await prisma.linha.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: "Linha removida com sucesso" });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao remover linha" });
  }
};

export const listarFaqsAdmin = async (req, res) => {
  try {
    const faqs = await prisma.faq.findMany({ orderBy: [{ ordem: "asc" }, { id: "asc" }] });
    res.json({ faqs: faqs.map(serializarFaq) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar FAQs" });
  }
};

export const salvarFaqAdmin = async (req, res) => {
  try {
    const data = {
      pergunta: req.body.pergunta,
      resposta: req.body.resposta,
      ordem: Number(req.body.ordem || 0),
    };
    const faq = req.params.id
      ? await prisma.faq.update({ where: { id: Number(req.params.id) }, data })
      : await prisma.faq.create({ data });
    res.json({ faq: serializarFaq(faq) });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao salvar FAQ" });
  }
};

export const removerFaqAdmin = async (req, res) => {
  try {
    await prisma.faq.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: "FAQ removida com sucesso" });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao remover FAQ" });
  }
};

export const listarNotificacoesAdmin = async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany({ orderBy: { data: "desc" } });
    res.json({ notificacoes: notificacoes.map(serializarNotificacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar notificacoes" });
  }
};

export const salvarNotificacaoAdmin = async (req, res) => {
  try {
    const data = {
      usuarioId: req.body.usuarioId ? Number(req.body.usuarioId) : null,
      tipo: req.body.tipo,
      titulo: req.body.titulo,
      descricao: req.body.descricao,
      lida: Boolean(req.body.lida),
      data: req.body.data ? new Date(req.body.data) : new Date(),
    };
    const notificacao = req.params.id
      ? await prisma.notificacao.update({ where: { id: Number(req.params.id) }, data })
      : await prisma.notificacao.create({ data });
    res.json({ notificacao: serializarNotificacao(notificacao) });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao salvar notificacao" });
  }
};

export const removerNotificacaoAdmin = async (req, res) => {
  try {
    await prisma.notificacao.delete({ where: { id: Number(req.params.id) } });
    res.json({ mensagem: "Notificacao removida com sucesso" });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao remover notificacao" });
  }
};

export const listarUsuariosAdmin = async (req, res) => {
  try {
    const usuarios = await prisma.user.findMany({
      include: { linhasMotorista: true, linhasCobrador: true },
      orderBy: { nome: "asc" },
    });
    res.json({ usuarios: usuarios.map(serializarUsuario) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar usuarios" });
  }
};

export const atualizarUsuarioAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const role = ["ADMIN", "MOTORISTA", "COBRADOR"].includes(req.body.role) ? req.body.role : "USER";
    const linhaIds = Array.isArray(req.body.motoristaLinhas)
      ? req.body.motoristaLinhas.map(Number).filter(Number.isFinite)
      : [];
    const cobradorLinhaIds = Array.isArray(req.body.cobradorLinhas)
      ? req.body.cobradorLinhas.map(Number).filter(Number.isFinite)
      : [];

    const usuario = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id },
        data: {
          nome: req.body.nome,
          email: req.body.email?.toLowerCase(),
          telefone: req.body.telefone || "",
          role,
          saldo: Number(req.body.saldo || 0),
        },
      });

      await tx.motoristaLinha.deleteMany({ where: { usuarioId: id } });
      await tx.cobradorLinha.deleteMany({ where: { usuarioId: id } });
      if (role === "MOTORISTA" && linhaIds.length) {
        await tx.motoristaLinha.createMany({
          data: linhaIds.map((linhaId) => ({ usuarioId: id, linhaId })),
          skipDuplicates: true,
        });
      }
      if (role === "COBRADOR" && cobradorLinhaIds.length) {
        await tx.cobradorLinha.createMany({
          data: cobradorLinhaIds.map((linhaId) => ({ usuarioId: id, linhaId })),
          skipDuplicates: true,
        });
      }
      if (role !== "MOTORISTA") {
        await tx.veiculoLocalizacao.deleteMany({ where: { usuarioId: id } });
      }

      return tx.user.findUnique({ where: { id }, include: { linhasMotorista: true, linhasCobrador: true } });
    });
    res.json({ usuario: serializarUsuario(usuario) });
  } catch (error) {
    res.status(400).json({ mensagem: "Erro ao atualizar usuario" });
  }
};
