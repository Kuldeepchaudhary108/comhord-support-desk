import express from "express";

import {
  getAgents,
  createAgent,
} from "../controllers/agent.controller.js";

import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.get(
  "/",
  getAgents
);

router.post(
  "/",
  authorizeRoles("admin"),
  createAgent
);

export default router;