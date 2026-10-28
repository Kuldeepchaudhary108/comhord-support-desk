import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAgents = asyncHandler(async (req, res) => {
  const agents = await User.find({
    role: {
      $in: ["agent", "admin"],
    },
  })
    .select("_id name email role avatar")
    .sort({ name: 1 });

  return res.status(200).json({
    success: true,
    data: agents,
  });
});

export const createAgent = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role = "agent",
  } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message:
        "Name, email and password are required",
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters long",
    });
  }

  if (!["agent", "admin"].includes(role)) {
    return res.status(400).json({
      success: false,
      message: "Invalid role",
    });
  }

  const existingUser = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists",
    });
  }

  const agent = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role,
  });

  const safeAgent = await User.findById(
    agent._id
  ).select("-password -refreshToken");

  return res.status(201).json({
    success: true,
    data: safeAgent,
    message: "Agent created successfully",
  });
});