import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  atualizarLocalizacao,
  minhasLinhas,
  pararCompartilhamento,
} from "../controllers/motorista.controller.js";

const router = Router();

router.use(auth);

router.get("/linhas", minhasLinhas);
router.post("/localizacao", atualizarLocalizacao);
router.post("/parar", pararCompartilhamento);

export default router;
