import { Router } from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import {
  atualizarLinhaAdmin,
  atualizarUsuarioAdmin,
  criarLinhaAdmin,
  listarFaqsAdmin,
  listarLinhasAdmin,
  listarNotificacoesAdmin,
  listarUsuariosAdmin,
  removerFaqAdmin,
  removerLinhaAdmin,
  removerNotificacaoAdmin,
  resumo,
  salvarFaqAdmin,
  salvarNotificacaoAdmin,
  listarRegrasCobrancaAdmin,
  salvarRegraCobrancaAdmin,
} from "../controllers/admin.controller.js";

const router = Router();

router.use(auth, admin);

router.get("/resumo", resumo);

router.get("/linhas", listarLinhasAdmin);
router.post("/linhas", criarLinhaAdmin);
router.put("/linhas/:id", atualizarLinhaAdmin);
router.delete("/linhas/:id", removerLinhaAdmin);

router.get("/faqs", listarFaqsAdmin);
router.post("/faqs", salvarFaqAdmin);
router.put("/faqs/:id", salvarFaqAdmin);
router.delete("/faqs/:id", removerFaqAdmin);

router.get("/notificacoes", listarNotificacoesAdmin);
router.post("/notificacoes", salvarNotificacaoAdmin);
router.put("/notificacoes/:id", salvarNotificacaoAdmin);
router.delete("/notificacoes/:id", removerNotificacaoAdmin);

router.get("/usuarios", listarUsuariosAdmin);
router.put("/usuarios/:id", atualizarUsuarioAdmin);

router.get("/regras-cobranca", listarRegrasCobrancaAdmin);
router.put("/regras-cobranca", salvarRegraCobrancaAdmin);

export default router;
