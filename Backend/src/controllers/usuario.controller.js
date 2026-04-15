import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";

export const obterPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario).select("-senha");
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }
    res.json({ usuario });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao buscar perfil" });
  }
};

export const atualizarPerfil = async (req, res) => {
  try {
    const { nome, email, telefone } = req.body;
    const dados = {};

    if (nome) dados.nome = nome;
    if (email) dados.email = email;
    if (telefone !== undefined) dados.telefone = telefone;

    const usuario = await Usuario.findByIdAndUpdate(req.usuario, dados, { new: true }).select("-senha");
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    res.json({ usuario });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensagem: "Email já está em uso" });
    }
    res.status(500).json({ mensagem: "Erro ao atualizar perfil" });
  }
};

export const alterarSenha = async (req, res) => {
  try {
    const { senhaAtual, novaSenha } = req.body;

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ mensagem: "Senha atual e nova senha são obrigatórias" });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ mensagem: "A nova senha deve ter pelo menos 6 caracteres" });
    }

    const usuario = await Usuario.findById(req.usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Senha atual incorreta" });
    }

    usuario.senha = await bcrypt.hash(novaSenha, 10);
    await usuario.save();

    res.json({ mensagem: "Senha alterada com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao alterar senha" });
  }
};

export const atualizarEndereco = async (req, res) => {
  try {
    const { cep, rua, numero, complemento, bairro, cidade, estado } = req.body;

    const usuario = await Usuario.findById(req.usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (cep !== undefined) usuario.endereco.cep = cep;
    if (rua !== undefined) usuario.endereco.rua = rua;
    if (numero !== undefined) usuario.endereco.numero = numero;
    if (complemento !== undefined) usuario.endereco.complemento = complemento;
    if (bairro !== undefined) usuario.endereco.bairro = bairro;
    if (cidade !== undefined) usuario.endereco.cidade = cidade;
    if (estado !== undefined) usuario.endereco.estado = estado;

    await usuario.save();

    res.json({ endereco: usuario.endereco });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar endereço" });
  }
};

export const atualizarPreferencias = async (req, res) => {
  try {
    const { notificacoesHorarios, alertasTarifa, newsletter } = req.body;

    const usuario = await Usuario.findById(req.usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    if (notificacoesHorarios !== undefined) usuario.preferencias.notificacoesHorarios = notificacoesHorarios;
    if (alertasTarifa !== undefined) usuario.preferencias.alertasTarifa = alertasTarifa;
    if (newsletter !== undefined) usuario.preferencias.newsletter = newsletter;

    await usuario.save();

    res.json({ preferencias: usuario.preferencias });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao atualizar preferências" });
  }
};

export const alterarTipoCartao = async (req, res) => {
  try {
    const { tipo } = req.body;

    if (!tipo || !["Comum", "Estudante", "Idoso"].includes(tipo)) {
      return res.status(400).json({ mensagem: "Tipo de cartão inválido. Use: Comum, Estudante ou Idoso" });
    }

    const usuario = await Usuario.findById(req.usuario);
    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado" });
    }

    usuario.cartao.tipo = tipo;
    await usuario.save();

    res.json({ cartao: usuario.cartao });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao alterar tipo do cartão" });
  }
};
