import prisma from "../config/prisma.js";
import { agruparHorarios, serializarLinha, serializarVeiculoLocalizacao } from "../utils/serializers.js";

export const listarLinhas = async (req, res) => {
  try {
    const { tipo, busca } = req.query;
    const filtro = { ativo: true };

    if (tipo) {
      filtro.tipoTransporte = tipo;
    }

    if (busca) {
      filtro.OR = [
        { nome: { contains: busca } },
        { origem: { contains: busca } },
        { destino: { contains: busca } },
      ];
    }

    const linhas = await prisma.linha.findMany({
      where: filtro,
      include: { pontos: true },
      orderBy: { numero: "asc" },
    });

    res.json({ total: linhas.length, linhas: linhas.map((linha) => serializarLinha(linha)) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar linhas" });
  }
};

export const obterLinha = async (req, res) => {
  try {
    const linha = await prisma.linha.findUnique({
      where: { id: Number(req.params.id) },
      include: { pontos: true, horarios: true },
    });

    if (!linha) {
      return res.status(404).json({ mensagem: "Linha nao encontrada" });
    }

    res.json({ linha: serializarLinha(linha, true) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar linha" });
  }
};

export const obterHorarios = async (req, res) => {
  try {
    const linha = await prisma.linha.findUnique({
      where: { id: Number(req.params.id) },
      include: { pontos: true, horarios: true },
    });

    if (!linha) {
      return res.status(404).json({ mensagem: "Linha nao encontrada" });
    }

    res.json({
      linha: serializarLinha(linha),
      horarios: agruparHorarios(linha.horarios),
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar horarios" });
  }
};

export const estatisticas = async (req, res) => {
  try {
    const totalLinhas = await prisma.linha.count({ where: { ativo: true } });
    const tipos = await prisma.linha.groupBy({ by: ["tipoTransporte"], where: { ativo: true } });
    const menorTarifa = await prisma.linha.findFirst({
      where: { ativo: true },
      orderBy: { tarifa: "asc" },
      select: { tarifa: true },
    });

    res.json({
      totalLinhas,
      tiposModal: tipos.length,
      tarifaMinima: menorTarifa ? Number(menorTarifa.tarifa) : 0,
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar estatisticas" });
  }
};

export const veiculosAtivos = async (req, res) => {
  try {
    const desde = new Date(Date.now() - 2 * 60 * 1000);
    const veiculos = await prisma.veiculoLocalizacao.findMany({
      where: { ativo: true, atualizadoEm: { gte: desde } },
      include: {
        usuario: true,
        linha: { include: { pontos: true } },
      },
      orderBy: { atualizadoEm: "desc" },
    });

    res.json({ veiculos: veiculos.map(serializarVeiculoLocalizacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar veiculos ativos" });
  }
};
