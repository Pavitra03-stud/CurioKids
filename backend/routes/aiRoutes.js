import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Progress from "../models/Progress.js";

dotenv.config();

const router = express.Router();

// ✅ Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Child average score: ${avg}.
Parent question: ${question}.

Give a simple, helpful answer for parents of dyslexic children.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ answer: text });

  } catch (err) {
    console.log("Gemini Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ================= AI ANALYSIS =================
router.get("/analysis/:childId", async (req, res) => {
  try {
    const { childId } = req.params;

    const progress = await Progress.find({ child: childId });

    if (progress.length === 0) {
      return res.json({ message: "No data yet" });
    }

    const avg =
      progress.reduce((sum, p) => sum + p.score, 0) / progress.length;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Child average score: ${avg}.

Give a short insight for parents.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      averageScore: avg,
      insight: text,
    });

  } catch (err) {
    console.log("Gemini Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;