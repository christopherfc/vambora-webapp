import Usuario from "../models/Usuario.js";
import Transacao from "../models/Transacao.js";

export const obterSaldo = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario).select("cartao");
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({
      saldo: usuario.cartao.saldo,
      cartao: {
        numero: usuario.cartao.numero,
        tipo: usuario.cartao.tipo,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar saldo" });
  }
};

export const listarTransacoes = async (req, res) => {
  try {
    const limite = parseInt(req.query.limite) || 10;

    const transacoes = await Transacao.find({ usuario: req.usuario })
      .sort({ data: -1 })
      .limit(limite);

    res.json({ transacoes });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar transações" });
  }
};
