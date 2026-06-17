import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  obterPerfil,
  atualizarPerfil,
  alterarSenha,
  atualizarEndereco,
  atualizarPreferencias,
  alterarTipoCartao,
  criarSolicitacaoBeneficio,
  listarSolicitacoesBeneficio,
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
router.get("/beneficios/solicitacoes", listarSolicitacoesBeneficio);
router.post("/beneficios/solicitacoes", criarSolicitacaoBeneficio);

export default router;
