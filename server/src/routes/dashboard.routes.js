import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  verifyJWT,
  getDashboardStats
);

router.get(
  "/stats",
  verifyJWT,
  getDashboardStats
);

export default router;