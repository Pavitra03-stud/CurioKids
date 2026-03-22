import express from "express";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// 🟢 SAVE PROGRESS
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { childId, game, score, completed } = req.body;

    const progress = new Progress({
      child: childId,
      game,
      score,
      completed
    });

    await progress.save();

    res.json({ message: "Progress saved ✅" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔵 GET CHILD PROGRESS
router.get("/:childId", authMiddleware, async (req, res) => {
  try {
    const progress = await Progress.find({
      child: req.params.childId
    }).sort({ createdAt: -1 });

    res.json(progress);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;