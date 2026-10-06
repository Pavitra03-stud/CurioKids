import express from "express";
import Child from "../models/Child.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ➕ Create Child
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    if (!name || !age) {
      return res.status(400).json({
        message: "Name and age are required ❌",
      });
    }

    const child = new Child({
      name,
      age,
      avatar,
      parent: req.user.userId,
    });

    await child.save();

    res.status(201).json({
      message: "Child created 👶",
      child,
    });

  } catch (error) {
    console.log("Create Child Error:", error);

    res.status(500).json({
      message: "Failed to create child ❌",
      error: error.message,
    });
  }
});


// 📥 Get all children for logged-in parent
router.get("/my-children", authMiddleware, async (req, res) => {
  try {

    const children = await Child.find({
      parent: req.user.userId,
    });

    res.json({
      children,
    });

  } catch (error) {
    console.log("Get Children Error:", error);

    res.status(500).json({
      message: "Failed to fetch children ❌",
      error: error.message,
    });
  }
});


export default router;