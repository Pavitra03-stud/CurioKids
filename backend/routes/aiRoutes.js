import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import Progress from "../models/Progress.js";

dotenv.config();

const router = express.Router();

// ✅ Correct OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ================= AI CHAT =================
router.post("/chat", async (req, res) => {
  try {
    const { childId, question } = req.body;

    const progress = await Progress.find({ child: childId });

    if (progress.length === 0) {
      return res.json({
        answer: "No data available yet 📊",
      });
    }

    const avg =
      progress.reduce((sum, p) => sum + p.score, 0) / progress.length;

    const prompt = `
Child average score: ${avg}.
Parent question: ${question}.

Give a helpful, simple answer for parents of dyslexic children.
`;

    // ✅ NEW WORKING METHOD
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const answer = response.output_text;

    res.json({ answer });

  } catch (err) {
    console.log("AI ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;