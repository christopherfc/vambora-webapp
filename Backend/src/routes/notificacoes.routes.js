import { Router } from "express";
import auth from "../middlewares/auth.js";
import { listarNotificacoes, marcarComoLida, contarNaoLidas } from "../controllers/notificacoes.controller.js";

const router = Router();

router.use(auth);

// Rota específica ANTES da rota com :id
router.get("/nao-lidas/count", contarNaoLidas);
router.get("/", listarNotificacoes);
router.put("/:id/lida", marcarComoLida);

export default router;
