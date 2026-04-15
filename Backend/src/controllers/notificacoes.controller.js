import Notificacao from "../models/Notificacao.js";

export const listarNotificacoes = async (req, res) => {
  try {
    const notificacoes = await Notificacao.find({ usuario: req.usuario })
      .sort({ data: -1 });

    res.json({ notificacoes });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar notificações" });
  }
};

export const marcarComoLida = async (req, res) => {
  try {
    const notificacao = await Notificacao.findOneAndUpdate(
      { _id: req.params.id, usuario: req.usuario },
      { lida: true },
      { new: true }
    );

    if (!notificacao) {
      return res.status(404).json({ mensagem: "Notificação não encontrada" });
    }

    res.json({ notificacao });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao marcar notificação" });
  }
};

export const contarNaoLidas = async (req, res) => {
  try {
    const count = await Notificacao.countDocuments({
      usuario: req.usuario,
      lida: false,
    });

    res.json({ count });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao contar notificações" });
  }
};
