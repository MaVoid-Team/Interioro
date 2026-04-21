import { Router } from "express";
import { designRequestController } from "../controllers/designRequest.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("readAny", "consultationRequest"), designRequestController.listConsultation);
router.get("/:id", authorize("readAny", "consultationRequest"), designRequestController.getConsultation);
router.put("/:id", authorize("updateAny", "consultationRequest"), designRequestController.updateConsultation);

export default router;
