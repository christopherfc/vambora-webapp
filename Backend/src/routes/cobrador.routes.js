import { Router } from "express";
import auth from "../middlewares/auth.js";
import { cobrarPassagem, minhasLinhasCobrador } from "../controllers/cobrador.controller.js";

const router = Router();

router.use(auth);

router.get("/linhas", minhasLinhasCobrador);
router.post("/cobrar", cobrarPassagem);

export default router;
