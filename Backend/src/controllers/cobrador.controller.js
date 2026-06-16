import prisma from "../config/prisma.js";
import { serializarLinha } from "../utils/serializers.js";

async function obterUsuario(req) {
  return prisma.user.findUnique({ where: { id: req.usuario } });
}

async function podeCobrarLinha(usuarioId, linhaId) {
  const vinculo = await prisma.cobradorLinha.findUnique({
    where: { usuarioId_linhaId: { usuarioId, linhaId } },
  });
  return Boolean(vinculo);
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

export const cobrarPassagem = async (req, res) => {
  try {
    const usuario = await obterUsuario(req);
    if (!usuario || !["COBRADOR", "ADMIN"].includes(usuario.role)) {
      return res.status(403).json({ mensagem: "Acesso restrito a cobradores" });
    }

    const linhaId = Number(req.body.linhaId);
    const codigo = String(req.body.codigo || "").trim();
    if (!linhaId || !codigo) {
      return res.status(400).json({ mensagem: "Linha e QR Code/cartao sao obrigatorios" });
    }

    const autorizado = usuario.role === "ADMIN" || await podeCobrarLinha(req.usuario, linhaId);
    if (!autorizado) {
      return res.status(403).json({ mensagem: "Cobrador nao autorizado para esta linha" });
    }

    const linha = await prisma.linha.findUnique({ where: { id: linhaId } });
    if (!linha) return res.status(404).json({ mensagem: "Linha nao encontrada" });

    const passageiro = await prisma.user.findUnique({ where: { cartaoNumero: codigo } });
    if (!passageiro) return res.status(404).json({ mensagem: "Cartao nao encontrado" });

    const valor = Number(linha.tarifa);
    if (Number(passageiro.saldo) < valor) {
      await prisma.cobranca.create({
        data: {
          cobradorId: req.usuario,
          passageiroId: passageiro.id,
          linhaId,
          valor,
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
      passageiro: { nome: passageiro.nome, cartao: passageiro.cartaoNumero },
      linha: { id: linha.id, numero: linha.numero, nome: linha.nome },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao cobrar passagem" });
  }
};
