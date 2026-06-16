import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { serializarUsuario, toCartaoTipo } from "../utils/serializers.js";

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await prisma.user.findUnique({ where: { id: req.usuario } });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }
    res.json({ usuario: serializarUsuario(usuario) });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar perfil" });
  }
};

export const atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const dados = {};

    if (nome) dados.nome = nome;
    if (email) dados.email = email.toLowerCase();
    if (telefone !== undefined) dados.telefone = telefone;

    const usuario = await prisma.user.update({ where: { id: req.usuario }, data: dados });
    res.json({ usuario: serializarUsuario(usuario) });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({ mensagem: "Email ja esta em uso" });
    }
    res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
  }
};

export const alterarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ mensagem: "Senha atual e nova senha sao obrigatorias" });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ mensagem: "A nova senha deve ter pelo menos 6 caracteres" });
    }

    const usuario = await prisma.user.findUnique({ where: { id: req.usuario } });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado" });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Senha atual incorreta" });
    }

    await prisma.user.update({
      where: { id: req.usuario },
      data: { senha: await bcrypt.hash(novaSenha, 10) },
    });

    res.json({ mensagem: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao alterar senha" });
  }
};

export const atualizarEndereco = async (req, res) => {
  try {
    const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;
    const data = {};

    if (cep !== undefined) data.cep = cep;
    if (rua !== undefined) data.rua = rua;
    if (numero !== undefined) data.numeroEndereco = numero;
    if (complemento !== undefined) data.complemento = complemento;
    if (bairro !== undefined) data.bairro = bairro;
    if (cidade !== undefined) data.cidade = cidade;
    if (estado !== undefined) data.estado = estado;

    const usuario = await prisma.user.update({ where: { id: req.usuario }, data });
    res.json({ endereco: serializarUsuario(usuario).endereco });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar endereco" });
  }
};

export const atualizarPreferencias = async (req, res) => {
  try {
    const { notificacoesHorarios, alertasTarifa, newsletter } = req.body;
    const data = {};

    if (notificacoesHorarios !== undefined) data.notificacoesHorarios = Boolean(notificacoesHorarios);
    if (alertasTarifa !== undefined) data.alertasTarifa = Boolean(alertasTarifa);
    if (newsletter !== undefined) data.newsletter = Boolean(newsletter);

    const usuario = await prisma.user.update({ where: { id: req.usuario }, data });
    res.json({ preferencias: serializarUsuario(usuario).preferencias });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar preferencias" });
  }
};

export const alterarTipoCartao = async (req, res) => {
  try {
    const { tipo } = req.body;

    if (!tipo || !["Comum", "Estudante", "Idoso"].includes(tipo)) {
      return res.status(400).json({ mensagem: "Tipo de cartao invalido. Use: Comum, Estudante ou Idoso" });
    }

    const usuario = await prisma.user.update({
      where: { id: req.usuario },
      data: { cartaoTipo: toCartaoTipo(tipo) },
    });

    res.json({ cartao: serializarUsuario(usuario).cartao });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao alterar tipo do cartao" });
  }
};
