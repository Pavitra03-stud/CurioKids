// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import Progress from "../models/Progress.js";

// dotenv.config();

// const router = express.Router();

// // ✅ Gemini setup
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // ================= AI CHAT =================
// router.post("/chat", async (req, res) => {
//   try {
//     const { childId, question } = req.body;

//     const progress = await Progress.find({ child: childId });

//     if (progress.length === 0) {
//       return res.json({
//         answer: "No data available yet 📊",
//       });
//     }

//     const avg =
//       progress.reduce((sum, p) => sum + p.score, 0) / progress.length;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
// Child average score: ${avg}.
// Parent question: ${question}.

// Give a simple, helpful answer for parents of dyslexic children.
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     res.json({ answer: text });

//   } catch (err) {
//     console.log("Gemini Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ================= AI ANALYSIS =================
// router.get("/analysis/:childId", async (req, res) => {
//   try {
//     const { childId } = req.params;

//     const progress = await Progress.find({ child: childId });

//     if (progress.length === 0) {
//       return res.json({ message: "No data yet" });
//     }

//     const avg =
//       progress.reduce((sum, p) => sum + p.score, 0) / progress.length;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
// Child average score: ${avg}.

// Give a short insight for parents.
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     res.json({
//       averageScore: avg,
//       insight: text,
//     });

//   } catch (err) {
//     console.log("Gemini Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;


import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// 🔥 Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🎯 AI ROUTE
router.post("/generate", async (req, res) => {
  try {
    const { input } = req.body;

    console.log("AI request:", input);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const prompt = `
    You are CurioKids AI, the educational assistant built specifically for the CurioKids website.

    ABOUT CURIOKIDS:
    CurioKids is an educational website designed for children.
    It provides interactive learning activities and games, with a
    focus on making learning easier and more enjoyable for children,
    including children with dyslexia.

    YOUR ROLE:
    - You are a friendly and supportive learning assistant.
    - Help children learn through simple explanations.
    - Help parents understand learning activities and progress.
    - Encourage children when they make mistakes.
    - Never shame or discourage a child.

    HOW YOU SHOULD ANSWER:
    - Use simple words.
    - Use short sentences.
    - Keep explanations easy for children to understand.
    - Use examples when helpful.
    - Use emojis naturally, but do not overuse them.
    - Keep the tone friendly, encouraging and positive.
    - When appropriate, suggest practicing through CurioKids activities.

    CURIOKIDS BOUNDARIES:
    - Your main purpose is to support learning through CurioKids.
    - Prefer answers related to education, learning and CurioKids activities.
    - Do not pretend that CurioKids has a feature or game if you do not know that it exists.
    - Do not make up information about a child's progress.
    - Do not diagnose dyslexia or other medical conditions.
    - If a question is completely unrelated to CurioKids or learning, politely
      guide the user back toward something CurioKids can help with.

    IMPORTANT:
    You are not a general-purpose chatbot.
    You are CurioKids AI.

    USER QUESTION:
    ${input}

    Answer the user as CurioKids AI.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    console.log("AI response:", text);

    res.json({ result: text });

  } catch (error) {
    console.log("Gemini error:", error);
    res.status(500).json({ message: "AI failed 😢" });
  }
});

export default router;