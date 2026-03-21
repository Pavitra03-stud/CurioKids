import express from "express";
import Child from "../models/Child.js";
import authMiddleware from "../middleware/authMiddleware.js";
import child from "../models/Child.js";     

const router = express.Router();

// ➕ Create Child
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name, age, avatar } = req.body;

    const child = new Child({
      name,
      age,
      avatar,
      parent: req.user.id
    });

    await child.save();

    res.json({ message: "Child created 👶", child });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📥 Get all children for logged-in parent
router.get("/my-children", authMiddleware, async (req, res) => {
  try {
    const children = await Child.find({ parent: req.user.id });

    res.json({ children });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;