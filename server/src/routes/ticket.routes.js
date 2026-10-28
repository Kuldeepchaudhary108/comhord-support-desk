import { Router } from "express";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  assignTicket,
  addReply,
} from "../controllers/ticket.controller.js";

import { verifyJWT, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/")
  .get(getTickets)
  .post(createTicket);

router
  .route("/:id")
  .get(getTicketById)
  .patch(updateTicket);

router.patch(
  "/:id/assign",
  authorizeRoles("admin"),
  assignTicket
);

router.post(
  "/:id/replies",
  addReply
);

export default router;