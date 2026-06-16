import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { serializarUsuario } from "../utils/serializers.js";

export const registrar = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ mensagem: "Nome, email e senha sao obrigatorios" });
    }

    const existente = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existente) {
      return res.status(400).json({ mensagem: "Email ja cadastrado" });
    }

    const hash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.user.create({
      data: {
        nome,
        email: email.toLowerCase(),
        senha: hash,
        telefone: telefone || "",
        cartaoNumero: String(Math.floor(1000 + Math.random() * 9000)),
      },
    });

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      usuario: serializarUsuario(usuario),
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ mensagem: "Email e senha sao obrigatorios" });
    }

    const usuario = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!usuario) {
      return res.status(401).json({ mensagem: "Email ou senha invalidos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "Email ou senha invalidos" });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      usuario: serializarUsuario(usuario),
    });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
};
