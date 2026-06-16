import { Router } from "express";
import { mercadoPagoWebhook } from "../controllers/recargas.controller.js";

const router = Router();

router.post("/mercado-pago", mercadoPagoWebhook);
router.get("/mercado-pago", mercadoPagoWebhook);

export default router;
