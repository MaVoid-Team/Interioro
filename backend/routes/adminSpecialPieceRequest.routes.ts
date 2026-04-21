import { Router } from "express";
import { designRequestController } from "../controllers/designRequest.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("readAny", "specialPieceRequest"), designRequestController.listSpecialPiece);
router.get("/:id", authorize("readAny", "specialPieceRequest"), designRequestController.getSpecialPiece);
router.put("/:id", authorize("updateAny", "specialPieceRequest"), designRequestController.updateSpecialPiece);

export default router;
