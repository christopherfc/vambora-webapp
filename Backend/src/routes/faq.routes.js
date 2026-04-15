import { Router } from "express";
import { listarFaqs } from "../controllers/faq.controller.js";

const router = Router();

router.get("/", listarFaqs);

export default router;
