import "dotenv/config";
import prisma from "../config/prisma.js";
import bootstrapAdmin from "../services/bootstrapAdmin.js";

try {
  await prisma.$connect();
  await bootstrapAdmin();
  console.log("Admin inicial pronto.");
  await prisma.$disconnect();
} catch (error) {
  console.error("Erro ao criar admin inicial:", error);
  await prisma.$disconnect();
  process.exit(1);
}
