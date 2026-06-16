import prisma from "../config/prisma.js";
import { fromCartaoTipo, serializarTransacao } from "../utils/serializers.js";

export const obterSaldo = async (req, res) => {
  try {
    const usuario = await prisma.user.findUnique({ where: { id: req.usuario } });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    res.json({
      saldo: Number(usuario.saldo),
      cartao: {
        numero: usuario.cartaoNumero,
        tipo: fromCartaoTipo(usuario.cartaoTipo),
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar saldo" });
  }
};

export const listarTransacoes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite, 10) || 10;
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuario },
      orderBy: { data: "desc" },
      take: limite,
    });

    res.json({ transacoes: transacoes.map(serializarTransacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar transacoes" });
  }
};
