import { Router } from "express";
import { listarLinhas, obterLinha, obterHorarios, estatisticas } from "../controllers/linhas.controller.js";

const router = Router();

// Rota de estatísticas ANTES da rota :id para evitar conflito
router.get("/estatisticas", estatisticas);
router.get("/", listarLinhas);
router.get("/:id", obterLinha);
router.get("/:id/horarios", obterHorarios);

export default router;
