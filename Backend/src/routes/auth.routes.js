import { Router } from "express";
import { login, redefinirSenha, registrar, solicitarRecuperacaoSenha } from "../controllers/auth.controller.js";

const router = Router();

router.post("/registrar", registrar);
router.post("/login", login);
router.post("/recuperar-senha", solicitarRecuperacaoSenha);
router.post("/redefinir-senha", redefinirSenha);

export default router;
