import prisma from "../config/prisma.js";
import { serializarLinha } from "../utils/serializers.js";

const JANELA_COBRANCA_DUPLICADA_MS = 2 * 60 * 1000;

async function obterUsuario(req) {
  return prisma.user.findUnique({ where: { id: req.usuario } });
}

async function podeCobrarLinha(usuarioId, linhaId) {
  const vinculo = await prisma.cobradorLinha.findUnique({
    where: { usuarioId_linhaId: { usuarioId, linhaId } },
  });
  return Boolean(vinculo);
}

async function montarResumoCobranca(req, { verificarDuplicidade = true } = {}) {
  const usuario = await obterUsuario(req);
  if (!usuario || !["COBRADOR", "ADMIN"].includes(usuario.role)) {
    return { erro: { status: 403, mensagem: "Acesso restrito a cobradores" } };
  }

  const linhaId = Number(req.body.linhaId);
  const codigo = String(req.body.codigo || "").trim();
  if (!linhaId || !codigo) {
    return { erro: { status: 400, mensagem: "Linha e QR Code/cartao sao obrigatorios" } };
  }

  const autorizado = usuario.role === "ADMIN" || await podeCobrarLinha(req.usuario, linhaId);
  if (!autorizado) {
    return { erro: { status: 403, mensagem: "Cobrador nao autorizado para esta linha" } };
  }

  const linha = await prisma.linha.findUnique({ where: { id: linhaId } });
  if (!linha) return { erro: { status: 404, mensagem: "Linha nao encontrada" } };

  const desdeVeiculo = new Date(Date.now() - 45 * 1000);
  const veiculoAtivo = await prisma.veiculoLocalizacao.findFirst({
    where: {
      linhaId,
      ativo: true,
      atualizadoEm: { gte: desdeVeiculo },
    },
  });
  if (!veiculoAtivo) {
    return { erro: { status: 400, mensagem: "Nenhum motorista ativo nesta linha no momento" } };
  }

  const passageiro = await prisma.user.findUnique({ where: { cartaoNumero: codigo } });
  if (!passageiro) return { erro: { status: 404, mensagem: "Cartao nao encontrado" } };

  if (verificarDuplicidade) {
    const desdeCobranca = new Date(Date.now() - JANELA_COBRANCA_DUPLICADA_MS);
    const cobrancaRecente = await prisma.cobranca.findFirst({
      where: {
        passageiroId: passageiro.id,
        linhaId,
        status: "APROVADA",
        data: { gte: desdeCobranca },
      },
      orderBy: { data: "desc" },
    });
    if (cobrancaRecente) {
      return {
        erro: {
          status: 409,
          mensagem: "Este cartao ja foi cobrado nesta linha ha pouco tempo. Aguarde 2 minutos para cobrar novamente.",
        },
      };
    }
  }

  const valorOriginal = Number(linha.tarifa);
  const regra = await prisma.regraCobranca.findUnique({ where: { tipoCartao: passageiro.cartaoTipo } });
  const descontoPercentual = regra?.ativo ? Number(regra.descontoPercentual) : 0;
  const valor = Number((valorOriginal * (1 - descontoPercentual / 100)).toFixed(2));
  const saldo = Number(passageiro.saldo);

  return {
    usuario,
    linha,
    passageiro,
    codigo,
    valorOriginal,
    descontoPercentual,
    valor,
    saldo,
    saldoAposCobranca: Number((saldo - valor).toFixed(2)),
  };
}

function serializarResumoCobranca(resumo) {
  return {
    passageiro: {
      id: resumo.passageiro.id,
      nome: resumo.passageiro.nome,
      cartao: resumo.passageiro.cartaoNumero,
      tipoCartao: resumo.passageiro.cartaoTipo,
      saldo: resumo.saldo,
    },
    linha: {
      id: resumo.linha.id,
      numero: resumo.linha.numero,
      nome: resumo.linha.nome,
      tipoTransporte: resumo.linha.tipoTransporte,
    },
    valorOriginal: resumo.valorOriginal,
    descontoPercentual: resumo.descontoPercentual,
    valor: resumo.valor,
    saldoAposCobranca: resumo.saldoAposCobranca,
    podeCobrar: resumo.saldo >= resumo.valor,
  };
}

export const minhasLinhasCobrador = async (req, res) => {
  try {
    const usuario = await obterUsuario(req);
    if (!usuario || !["COBRADOR", "ADMIN"].includes(usuario.role)) {
      return res.status(403).json({ mensagem: "Acesso restrito a cobradores" });
    }

    const vinculos = await prisma.cobradorLinha.findMany({
      where: { usuarioId: req.usuario },
      include: { linha: { include: { pontos: true, paradas: true, horarios: true } } },
      orderBy: { linha: { numero: "asc" } },
    });

    res.json({ linhas: vinculos.map((v) => serializarLinha(v.linha, true)) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar linhas do cobrador" });
  }
};

export const consultarCobranca = async (req, res) => {
  try {
    const resumo = await montarResumoCobranca(req);
    if (resumo.erro) return res.status(resumo.erro.status).json({ mensagem: resumo.erro.mensagem });

    res.json({
      mensagem: "Resumo da cobranca",
      cobranca: serializarResumoCobranca(resumo),
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao consultar cobranca" });
  }
};

export const cobrarPassagem = async (req, res) => {
  try {
    const resumo = await montarResumoCobranca(req);
    if (resumo.erro) return res.status(resumo.erro.status).json({ mensagem: resumo.erro.mensagem });

    const { linha, passageiro, codigo, valor, valorOriginal, descontoPercentual } = resumo;
    const linhaId = linha.id;

    if (resumo.saldo < valor) {
      await prisma.cobranca.create({
        data: {
          cobradorId: req.usuario,
          passageiroId: passageiro.id,
          linhaId,
          valor,
          valorOriginal,
          descontoPercentual,
          status: "RECUSADA",
          codigoCartao: codigo,
        },
      });
      return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const atualizado = await tx.user.update({
        where: { id: passageiro.id },
        data: { saldo: { decrement: valor } },
      });
      const cobranca = await tx.cobranca.create({
        data: {
          cobradorId: req.usuario,
          passageiroId: passageiro.id,
          linhaId,
          valor,
          valorOriginal,
          descontoPercentual,
          status: "APROVADA",
          codigoCartao: codigo,
        },
      });
      await tx.transacao.create({
        data: {
          usuarioId: passageiro.id,
          descricao: `Passagem - Linha ${linha.numero} - ${linha.nome}`,
          valor: -valor,
          tipo: linha.tipoTransporte,
          data: new Date(),
        },
      });
      return { atualizado, cobranca };
    });

    res.json({
      mensagem: "Pagamento aprovado",
      saldo: Number(resultado.atualizado.saldo),
      cobranca: { id: resultado.cobranca.id, valor },
      descontoPercentual,
      valorOriginal,
      passageiro: { nome: passageiro.nome, cartao: passageiro.cartaoNumero, tipoCartao: passageiro.cartaoTipo },
      linha: { id: linha.id, numero: linha.numero, nome: linha.nome },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cobrar passagem" });
  }
};
