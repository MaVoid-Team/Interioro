import { Router } from "express";
import { designRequestController } from "../controllers/designRequest.controller";
import { attachUserIfAuthenticated } from "../middleware/auth.middleware";
import { multipleImageUpload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/custom",
  attachUserIfAuthenticated,
  multipleImageUpload("inspirationImages", 5),
  designRequestController.submitCustom
);
router.post(
  "/special-piece",
  attachUserIfAuthenticated,
  multipleImageUpload("inspirationImages", 5),
  designRequestController.submitSpecialPiece
);
router.post(
  "/consultation",
  attachUserIfAuthenticated,
  multipleImageUpload("inspirationImages", 5),
  designRequestController.submitConsultation
);

export default router;
