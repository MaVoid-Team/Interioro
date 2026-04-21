import { Router } from "express";
import adminUserRoutes from "./adminUser.routes";
import adminOrderRoutes from "./adminOrder.routes";
import locationRoutes from "./location.routes";
import adminDiscountRoutes from "./adminDiscount.routes";
import adminBundleRoutes from "./adminBundle.routes";
import adminPortfolioRoutes from "./adminPortfolio.routes";
import adminCustomDesignRequestRoutes from "./adminCustomDesignRequest.routes";
import adminSpecialPieceRequestRoutes from "./adminSpecialPieceRequest.routes";
import adminConsultationRequestRoutes from "./adminConsultationRequest.routes";

const router = Router();

router.use("/users", adminUserRoutes);
router.use("/orders", adminOrderRoutes);
router.use("/locations", locationRoutes);
router.use("/discounts", adminDiscountRoutes);
router.use("/bundles", adminBundleRoutes);
router.use("/portfolio", adminPortfolioRoutes);
router.use("/custom-design-requests", adminCustomDesignRequestRoutes);
router.use("/special-piece-requests", adminSpecialPieceRequestRoutes);
router.use("/consultation-requests", adminConsultationRequestRoutes);

export default router;
