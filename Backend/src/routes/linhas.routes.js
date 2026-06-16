import { Router } from "express";
import { listarLinhas, obterLinha, obterHorarios, estatisticas, veiculosAtivos } from "../controllers/linhas.controller.js";

const router = Router();

// Rota de estatísticas ANTES da rota :id para evitar conflito
router.get("/estatisticas", estatisticas);
router.get("/veiculos-ativos", veiculosAtivos);
router.get("/", listarLinhas);
router.get("/:id", obterLinha);
router.get("/:id/horarios", obterHorarios);

export default router;
