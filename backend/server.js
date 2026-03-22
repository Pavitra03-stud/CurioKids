import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import childRoutes from "./routes/childRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/child", childRoutes);
app.use("/api/progress", progressRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized 🔥",
    user: req.user
  });
});

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/curiokids")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000 🔥");
});