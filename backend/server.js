import dotenv from "dotenv";
dotenv.config(); // ⭐ MUST BE FIRST

console.log("🚀 Starting server...");

// ✅ DEBUG (VERY IMPORTANT)
console.log("EMAIL:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Routes
import authRoutes from "./routes/authRoutes.js";
import childRoutes from "./routes/childRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes setup
app.use("/api", authRoutes);
app.use("/api/child", childRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);

// ✅ Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/curiokids")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌", err));

// ✅ Start server
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});
