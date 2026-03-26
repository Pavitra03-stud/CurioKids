import express from "express";
import Progress from "../models/Progress.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// 🟢 SAVE PROGRESS
router.post("/save", authMiddleware, async (req, res) => {
  try {
    const { childId, game, score, completed } = req.body;

    // ❗ Validation
    if (!childId || !game) {
      return res.status(400).json({
        message: "childId and game are required ❌"
      });
    }

    // 👉 Create progress
    const progress = new Progress({
      child: childId,
      game,
      score: score || 0,
      completed: completed || false
    });

    await progress.save();

    res.status(200).json({
      message: "Progress saved ✅",
      data: progress
    });

  } catch (err) {
    console.log("Save Progress Error:", err);
    res.status(500).json({
      message: "Server error ❌",
      error: err.message
    });
  }
});


// 🔵 GET CHILD PROGRESS
router.get("/:childId", authMiddleware, async (req, res) => {
  try {
    const { childId } = req.params;

    const progress = await Progress.find({
      child: childId
    }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Progress fetched ✅",
      data: progress
    });

  } catch (err) {
    console.log("Fetch Progress Error:", err);
    res.status(500).json({
      message: "Server error ❌",
      error: err.message
    });
  }
});


// 🟡 GET SUMMARY (🔥 VERY IMPORTANT FOR DASHBOARD)
router.get("/summary/:childId", authMiddleware, async (req, res) => {
  try {
    const { childId } = req.params;

    const progress = await Progress.find({ child: childId });

    const totalGames = progress.length;

    const completedGames = progress.filter(p => p.completed).length;

    const totalScore = progress.reduce((sum, p) => sum + (p.score || 0), 0);

    res.json({
      totalGames,
      completedGames,
      totalScore
    });

  } catch (err) {
    console.log("Summary Error:", err);
    res.status(500).json({
      message: "Server error ❌"
    });
  }
});


// 🔴 DELETE PROGRESS (optional - for reset)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Progress.findByIdAndDelete(req.params.id);

    res.json({ message: "Progress deleted 🗑️" });

  } catch (err) {
    res.status(500).json({
      message: "Delete failed ❌"
    });
  }
});

export default router;