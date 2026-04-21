import { Router } from "express";
import { designRequestController } from "../controllers/designRequest.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("readAny", "customDesignRequest"), designRequestController.listCustom);
router.get("/:id", authorize("readAny", "customDesignRequest"), designRequestController.getCustom);
router.put("/:id", authorize("updateAny", "customDesignRequest"), designRequestController.updateCustom);

export default router;
