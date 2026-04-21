import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller";

const router = Router();

router.get("/", portfolioController.listPublic);
router.get("/:slug", portfolioController.getPublicBySlug);

export default router;
