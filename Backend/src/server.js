import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import linhasRoutes from "./routes/linhas.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import transacoesRoutes from "./routes/transacoes.routes.js";
import notificacoesRoutes from "./routes/notificacoes.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import bootstrapAdmin from "./services/bootstrapAdmin.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://frontend:5173",
  ],
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/linhas", linhasRoutes);
app.use("/api/usuario", usuarioRoutes);
app.use("/api/usuario", transacoesRoutes);
app.use("/api/usuario/notificacoes", notificacoesRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({ mensagem: "API Vambora Penedo v1.0" });
});

connectDB().then(async () => {
  await bootstrapAdmin();
  app.listen(PORT, () => {
    console.log(`Servidor Vambora Penedo rodando em http://localhost:${PORT}`);
  });
});
