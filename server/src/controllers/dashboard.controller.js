import { Ticket } from "../models/Ticket.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getOverdueStatus } from "../utils/ticket.utils.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const tickets = await Ticket.find();

  const total = tickets.length;
  const open = tickets.filter((ticket) => ticket.status === "open").length;
  const inProgress = tickets.filter((ticket) => ticket.status === "in-progress").length;
  const waitingOnCustomer = tickets.filter(
    (ticket) => ticket.status === "waiting-on-customer"
  ).length;
  const resolved = tickets.filter((ticket) => ticket.status === "resolved").length;
  const urgent = tickets.filter((ticket) => ticket.priority === "urgent").length;
  const overdue = tickets.filter((ticket) => getOverdueStatus(ticket)).length;

  const stats = {
    total,
    totalTickets: total,
    open,
    openTickets: open,
    inProgress,
    inProgressTickets: inProgress,
    waitingOnCustomer,
    waitingTickets: waitingOnCustomer,
    resolved,
    resolvedTickets: resolved,
    urgent,
    urgentTickets: urgent,
    overdue,
    overdueTickets: overdue,
  };

  const recentTickets = await Ticket.find()
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("assignedTo", "name email role");

  res
    .status(200)
    .json(new ApiResponse(200, { stats, recentTickets }, "Dashboard statistics fetched"));
});
