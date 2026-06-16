import prisma from "../config/prisma.js";
import { serializarNotificacao } from "../utils/serializers.js";

export const listarNotificacoes = async (req, res) => {
  try {
    const notificacoes = await prisma.notificacao.findMany({
      where: { OR: [{ usuarioId: req.usuario }, { usuarioId: null }] },
      orderBy: { data: "desc" },
    });

    res.json({ notificacoes: notificacoes.map(serializarNotificacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar notificacoes" });
  }
};

export const marcarComoLida = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const atual = await prisma.notificacao.findFirst({
      where: { id, OR: [{ usuarioId: req.usuario }, { usuarioId: null }] },
    });

    if (!atual) {
      return res.status(404).json({ mensagem: "Notificacao nao encontrada" });
    }

    const notificacao = await prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });

    res.json({ notificacao: serializarNotificacao(notificacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao marcar notificacao" });
  }
};

export const contarNaoLidas = async (req, res) => {
  try {
    const count = await prisma.notificacao.count({
      where: {
        lida: false,
        OR: [{ usuarioId: req.usuario }, { usuarioId: null }],
      },
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao contar notificacoes" });
  }
};
