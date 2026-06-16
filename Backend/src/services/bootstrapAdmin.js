import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";

export default async function bootstrapAdmin() {
  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const senha = process.env.ADMIN_PASSWORD;
  const nome = process.env.ADMIN_NAME || "Administrador";

  if (!email || !senha) return;

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    if (existente.role !== "ADMIN") {
      await prisma.user.update({ where: { id: existente.id }, data: { role: "ADMIN" } });
    }
    return;
  }

  await prisma.user.create({
    data: {
      nome,
      email,
      senha: await bcrypt.hash(senha, 10),
      role: "ADMIN",
      cartaoNumero: "0001",
    },
  });
}
