import { Router } from "express";
import auth from "../middlewares/auth.js";
import { criarRecarga, listarRecargas } from "../controllers/recargas.controller.js";

const router = Router();

router.use(auth);

router.get("/recargas", listarRecargas);
router.post("/recargas", criarRecarga);

export default router;
