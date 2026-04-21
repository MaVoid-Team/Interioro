import { Router } from "express";
import { portfolioController } from "../controllers/portfolio.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { fieldImageUploads } from "../middleware/upload.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("readAny", "portfolioProject"), portfolioController.listAdmin);
router.get("/:id", authorize("readAny", "portfolioProject"), portfolioController.getAdminById);
router.post(
  "/",
  authorize("createAny", "portfolioProject"),
  fieldImageUploads([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  portfolioController.create
);
router.put(
  "/:id",
  authorize("updateAny", "portfolioProject"),
  fieldImageUploads([
    { name: "coverImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 10 },
  ]),
  portfolioController.update
);
router.delete("/:id", authorize("deleteAny", "portfolioProject"), portfolioController.delete);

export default router;
