import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { User } from "./models/User.model.js";

dotenv.config();

const createAdmin = async () => {
  await connectDB();

  const existingAdmin =
    await User.findOne({
      email: "admin@support.com",
    });

  if (existingAdmin) {
    console.log("Admin already exists");
    process.exit(0);
  }

  await User.create({
    name: "Support Admin",
    email: "admin@support.com",
    password: "admin123",
    role: "admin",
  });

  console.log("Admin created");

  process.exit(0);
};

createAdmin();