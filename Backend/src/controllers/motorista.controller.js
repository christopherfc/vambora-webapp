import prisma from "../config/prisma.js";
import { serializarLinha, serializarVeiculoLocalizacao } from "../utils/serializers.js";

async function obterUsuario(req) {
  return prisma.user.findUnique({ where: { id: req.usuario } });
}

async function podeOperarLinha(usuarioId, linhaId) {
  const vinculo = await prisma.motoristaLinha.findUnique({
    where: { usuarioId_linhaId: { usuarioId, linhaId } },
  });
  return Boolean(vinculo);
}

export const minhasLinhas = async (req, res) => {
  try {
    const usuario = await obterUsuario(req);
    if (!usuario || !["MOTORISTA", "ADMIN"].includes(usuario.role)) {
      return res.status(403).json({ mensagem: "Acesso restrito a motoristas" });
    }

    const vinculos = await prisma.motoristaLinha.findMany({
      where: { usuarioId: req.usuario },
      include: { linha: { include: { pontos: true, horarios: true } } },
      orderBy: { linha: { numero: "asc" } },
    });

    res.json({ linhas: vinculos.map((v) => serializarLinha(v.linha, true)) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao listar linhas do motorista" });
  }
};

export const atualizarLocalizacao = async (req, res) => {
  try {
    const usuario = await obterUsuario(req);
    if (!usuario || !["MOTORISTA", "ADMIN"].includes(usuario.role)) {
      return res.status(403).json({ mensagem: "Acesso restrito a motoristas" });
    }

    const linhaId = Number(req.body.linhaId);
    const latitude = Number(req.body.latitude);
    const longitude = Number(req.body.longitude);
    const precisao = req.body.precisao !== undefined ? Number(req.body.precisao) : null;

    if (!linhaId || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      return res.status(400).json({ mensagem: "Linha e localizacao sao obrigatorias" });
    }

    const autorizado = usuario.role === "ADMIN" || await podeOperarLinha(req.usuario, linhaId);
    if (!autorizado) {
      return res.status(403).json({ mensagem: "Motorista nao autorizado para esta linha" });
    }

    const localizacao = await prisma.veiculoLocalizacao.upsert({
      where: { usuarioId: req.usuario },
      create: {
        usuarioId: req.usuario,
        linhaId,
        latitude,
        longitude,
        precisao: Number.isFinite(precisao) ? precisao : null,
        ativo: true,
        atualizadoEm: new Date(),
      },
      update: {
        linhaId,
        latitude,
        longitude,
        precisao: Number.isFinite(precisao) ? precisao : null,
        ativo: true,
        atualizadoEm: new Date(),
      },
      include: { usuario: true, linha: { include: { pontos: true } } },
    });

    res.json({ veiculo: serializarVeiculoLocalizacao(localizacao) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar localizacao" });
  }
};

export const pararCompartilhamento = async (req, res) => {
  try {
    await prisma.veiculoLocalizacao.updateMany({
      where: { usuarioId: req.usuario },
      data: { ativo: false, atualizadoEm: new Date() },
    });
    res.json({ mensagem: "Compartilhamento encerrado" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao encerrar compartilhamento" });
  }
};

export const veiculosAtivos = async (req, res) => {
  try {
    const desde = new Date(Date.now() - 45 * 1000);
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
    res.status(500).json({ mensagem: "Erro ao listar veiculos ativos" });
  }
};
