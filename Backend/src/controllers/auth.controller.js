import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { serializarUsuario } from "../utils/serializers.js";

const RESET_TOKEN_MINUTOS = 60;

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function frontendUrl() {
  return (process.env.FRONTEND_URL || "http://localhost:5173").split(",")[0].trim().replace(/\/$/, "");
}

async function enviarEmailRecuperacao({ email, nome, token }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY nao configurada");
  }

  const from = process.env.EMAIL_FROM || "Vambora Penedo <onboarding@resend.dev>";
  const link = `${frontendUrl()}/?resetToken=${encodeURIComponent(token)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: "Recuperacao de senha - Vambora Penedo",
      html: `
        <div style="font-family: Arial, sans-serif; color: #2b1b1b; line-height: 1.5;">
          <h2>Recuperacao de senha</h2>
          <p>Ola, ${nome || "usuario"}.</p>
          <p>Recebemos uma solicitacao para redefinir sua senha no Vambora Penedo.</p>
          <p><a href="${link}" style="display:inline-block;background:#FE8A00;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">Redefinir senha</a></p>
          <p>Este link expira em ${RESET_TOKEN_MINUTOS} minutos.</p>
          <p>Se voce nao solicitou isso, ignore este email.</p>
        </div>
      `,
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Erro ao enviar email de recuperacao");
  }
}

async function gerarCartaoNumero() {
  for (let i = 0; i < 10; i += 1) {
    const numero = String(Math.floor(100000 + Math.random() * 900000));
    const existente = await prisma.user.findUnique({ where: { cartaoNumero: numero } });
    if (!existente) return numero;
  }
  return String(Date.now()).slice(-8);
}

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
        cartaoNumero: await gerarCartaoNumero(),
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

export const solicitarRecuperacaoSenha = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ mensagem: "Email e obrigatorio" });
    }

    const usuario = await prisma.user.findUnique({ where: { email } });
    const mensagem = "Se o email estiver cadastrado, enviaremos um link de recuperacao.";

    if (!usuario) {
      return res.json({ mensagem });
    }

    await prisma.passwordResetToken.updateMany({
      where: { usuarioId: usuario.id, usadoEm: null },
      data: { usadoEm: new Date() },
    });

    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        usuarioId: usuario.id,
        tokenHash: hashToken(token),
        expiraEm: new Date(Date.now() + RESET_TOKEN_MINUTOS * 60 * 1000),
      },
    });

    await enviarEmailRecuperacao({ email: usuario.email, nome: usuario.nome, token });
    res.json({ mensagem });
  } catch (error) {
    console.error("Erro ao solicitar recuperacao de senha:", error);
    res.status(500).json({
      mensagem: "Erro ao solicitar recuperacao de senha",
      detalhe: error.message,
    });
  }
};

export const redefinirSenha = async (req, res) => {
  try {
    const token = String(req.body.token || "").trim();
    const novaSenha = String(req.body.novaSenha || "");

    if (!token || !novaSenha) {
      return res.status(400).json({ mensagem: "Token e nova senha sao obrigatorios" });
    }
    if (novaSenha.length < 6) {
      return res.status(400).json({ mensagem: "A nova senha deve ter pelo menos 6 caracteres" });
    }

    const tokenSalvo = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
    });

    if (!tokenSalvo || tokenSalvo.usadoEm || tokenSalvo.expiraEm < new Date()) {
      return res.status(400).json({ mensagem: "Link de recuperacao invalido ou expirado" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: tokenSalvo.usuarioId },
        data: { senha: await bcrypt.hash(novaSenha, 10) },
      });
      await tx.passwordResetToken.update({
        where: { id: tokenSalvo.id },
        data: { usadoEm: new Date() },
      });
    });

    res.json({ mensagem: "Senha redefinida com sucesso" });
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao redefinir senha" });
  }
};
