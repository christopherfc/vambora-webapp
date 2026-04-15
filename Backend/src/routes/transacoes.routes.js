import { Router } from "express";
import auth from "../middlewares/auth.js";
import { obterSaldo, listarTransacoes } from "../controllers/transacoes.controller.js";

const router = Router();

router.use(auth);

router.get("/saldo", obterSaldo);
router.get("/transacoes", listarTransacoes);

export default router;
