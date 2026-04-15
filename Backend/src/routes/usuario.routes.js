import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  obterPerfil,
  atualizarPerfil,
  alterarSenha,
  atualizarEndereco,
  atualizarPreferencias,
  alterarTipoCartao,
} from "../controllers/usuario.controller.js";

const router = Router();

// Todas protegidas com JWT
router.use(auth);

router.get("/perfil", obterPerfil);
router.put("/perfil", atualizarPerfil);
router.put("/senha", alterarSenha);
router.put("/endereco", atualizarEndereco);
router.put("/preferencias", atualizarPreferencias);
router.put("/cartao/tipo", alterarTipoCartao);

export default router;
