import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Support Desk API is running",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tickets",
  ticketRoutes
);

app.use(
  "/api/agents",
  agentRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: Object.values(err.errors || {})
        .map((e) => e.message)
        .join(", ") || err.message,
      errors: err.errors || [],
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid resource ID",
      errors: [],
    });
  }

  const statusCode =
    err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      err.message || "Internal server error",
    errors: err.errors || [],
  });
});

export default app;