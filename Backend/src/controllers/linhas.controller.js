import Linha from "../models/Linha.js";

export const listarLinhas = async (req, res) => {
  try {
    const { tipo, busca } = req.query;
    const filtro = {};

    if (tipo) {
      filtro.tipoTransporte = tipo;
    }

    if (busca) {
      const regex = new RegExp(busca, "i");
      filtro.$or = [
        { nome: regex },
        { origem: regex },
        { destino: regex },
      ];
    }

    const linhas = await Linha.find(filtro).select("-horarios").sort({ numero: 1 });

    res.json({ total: linhas.length, linhas });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar linhas" });
  }
};

export const obterLinha = async (req, res) => {
  try {
    const linha = await Linha.findById(req.params.id);
    if (!linha) {
      return res.status(404).json({ mensagem: "Linha não encontrada" });
    }
    res.json({ linha });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar linha" });
  }
};

export const obterHorarios = async (req, res) => {
  try {
    const linha = await Linha.findById(req.params.id);
    if (!linha) {
      return res.status(404).json({ mensagem: "Linha não encontrada" });
    }

    res.json({
      linha: {
        _id: linha._id,
        numero: linha.numero,
        nome: linha.nome,
        tipoTransporte: linha.tipoTransporte,
        tarifa: linha.tarifa,
        infoPagamento: linha.infoPagamento,
        origem: linha.origem,
        destino: linha.destino,
        ativo: linha.ativo,
        rota: linha.rota,
      },
      horarios: {
        util: linha.horarios.util,
        sabado: linha.horarios.sabado,
        domingo_feriado: linha.horarios.domingo_feriado,
      },
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar horários" });
  }
};

export const estatisticas = async (req, res) => {
  try {
    const totalLinhas = await Linha.countDocuments();
    const tipos = await Linha.distinct("tipoTransporte");
    const menorTarifa = await Linha.findOne().sort({ tarifa: 1 }).select("tarifa");

    res.json({
      totalLinhas,
      tiposModal: tipos.length,
      tarifaMinima: menorTarifa ? menorTarifa.tarifa : 0,
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar estatísticas" });
  }
};
