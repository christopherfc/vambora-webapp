import prisma from "../config/prisma.js";

export default async function admin(req, res, next) {
  try {
    const usuario = await prisma.user.findUnique({ where: { id: req.usuario } });
    if (!usuario || usuario.role !== "ADMIN") {
      return res.status(403).json({ mensagem: "Acesso restrito ao administrador" });
    }
    req.admin = usuario;
    next();
  } catch (error) {
    res.status(500).json({ mensagem: "Erro ao validar administrador" });
  }
}
