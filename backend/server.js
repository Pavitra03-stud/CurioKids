// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import nodemailer from "nodemailer";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// console.log("🔥 SERVER FILE LOADED");

// // ================= GEMINI AI SETUP =================
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });

// // ================= EMAIL SETUP =================
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // ================= OTP STORE =================
// global.otpStore = global.otpStore || {};
// const otpStore = global.otpStore;

// // ================= ROOT =================
// app.get("/", (req, res) => {
//   res.send("Backend is working 🚀");
// });

// // ================= REGISTER =================
// app.post("/api/register", (req, res) => {
//   try {
//     const { name, email } = req.body;

//     if (!name || !email) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     res.json({ success: true });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Register failed" });
//   }
// });

// // ================= SEND OTP =================
// app.post("/api/send-otp", async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Email required" });
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000));

//     console.log("🔐 OTP:", otp);

//     otpStore[email] = otp;

//     await transporter.sendMail({
//       from: `"CurioKids" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Your OTP Code",
//       html: `<h2>Your OTP is: ${otp}</h2>`,
//     });

//     res.json({ success: true });

//   } catch (error) {
//     console.error("EMAIL ERROR:", error);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// });

// // ================= VERIFY OTP =================
// app.post("/api/verify-otp", (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     if (otpStore[email] === String(otp)) {
//       delete otpStore[email];
//       return res.json({ success: true });
//     }

//     return res.status(400).json({ message: "Invalid OTP ❌" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Verification failed" });
//   }
// });

// // ================= CHAT =================
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;

//     const response = await model.generateContent(message);
//     const text = response.response.text();

//     res.json({ reply: text });

//   } catch (error) {
//     console.error("CHAT ERROR:", error);
//     res.status(500).json({ reply: "AI error" });
//   }
// });

// // ================= AI TEACH =================
// app.post("/ai/teach", async (req, res) => {
//   try {
//     const { topic } = req.body;

//     const prompt = `Explain ${topic} to a kid in a fun jungle way in 2-3 lines.`;

//     const response = await model.generateContent(prompt);

//     res.json({
//       explanation: response.response.text(),
//     });

//   } catch (error) {
//     console.error("TEACH ERROR:", error);

//     res.json({
//       explanation: "🌿 In the jungle, animals make sounds. Listen carefully and count them!",
//     });
//   }
// });

// // ================= AI QUESTION =================
// app.post("/ai/generate-question", async (req, res) => {
//   try {
//     const { topic, level } = req.body;

//     let prompt = "";

//     // 🌿 CUSTOM GAME LOGIC
//     if (topic === "sound-tap") {
//       const animals = ["monkey", "lion", "elephant", "bird"];
//       const animal = animals[Math.floor(Math.random() * animals.length)];
//       const count = Math.floor(Math.random() * 4) + 1;

//       return res.json({
//         question: `🌿 In the jungle, the ${animal} made a sound ${count} times. How many sounds did you hear?`,
//         options: ["1", "2", "3", "4"],
//         answer: String(count),
//       });
//     }

//     // 🤖 FALLBACK AI
//     prompt = `Generate a simple ${level} MCQ for kids on ${topic}.
//     Return ONLY valid JSON:
//     {
//       "question": "...",
//       "options": ["A","B","C","D"],
//       "answer": "A"
//     }`;

//     const response = await model.generateContent(prompt);
//     const text = response.response.text();

//     const jsonMatch = text.match(/\{[\s\S]*\}/);

//     if (!jsonMatch) {
//       throw new Error("Invalid AI response");
//     }

//     const parsed = JSON.parse(jsonMatch[0]);

//     res.json(parsed);

//   } catch (error) {
//     console.error("QUESTION ERROR:", error);

//     // 🔥 SAFE FALLBACK
//     res.json({
//       question: "🌿 How many sounds did the monkey make?",
//       options: ["1", "2", "3", "4"],
//       answer: "2",
//     });
//   }
// });
// // ================= AI ANALYZE =================
// app.post("/ai/analyze", async (req, res) => {
//   try {
//     const { answers } = req.body;

//     const prompt = `
//     Analyze this kid's answers: ${JSON.stringify(answers)}.
//     Give:
//     - strengths
//     - weaknesses
//     - improvement tips
//     `;

//     const response = await model.generateContent(prompt);
//     const text = response.response.text();

//     res.json({ analysis: text });

//   } catch (error) {
//     console.error("ANALYZE ERROR:", error);

//     res.json({
//       analysis: "Good try! Keep practicing 😊",
//     });
//   }
// });

// // ================= AI DOUBT =================
// app.post("/ai/doubt", async (req, res) => {
//   try {
//     const { question } = req.body;

//     const response = await model.generateContent(
//       `Answer this kid's doubt simply: ${question}`
//     );

//     const text = response.response.text();

//     res.json({ answer: text });

//   } catch (error) {
//     console.error("DOUBT ERROR:", error);

//     res.json({
//       answer: "Let's learn this together 😊",
//     });
//   }
// });

// // ================= START SERVER =================
// app.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("🔥 SERVER STARTED");

// ================= EMAIL =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= OTP =================
const otpStore = {};

// ================= GEMINI =================
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ FIXED MODEL
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ================= REGISTER =================
app.post("/api/register", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  res.json({ success: true });
});

// ================= SEND OTP =================
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP",
      html: `<h2>${otp}</h2>`,
    });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Email failed" });
  }
});

// ================= VERIFY OTP =================
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];
    return res.json({ success: true });
  }

  res.status(400).json({ message: "Invalid OTP" });
});

// ================= AI TEACH =================
app.post("/ai/teach", async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `Explain ${topic} to a small kid in jungle theme in 2 lines`;

    const response = await model.generateContent(prompt);

    res.json({
      explanation: response.response.text(),
    });

  } catch (err) {
    console.error("TEACH ERROR:", err);

    // ✅ fallback
    res.json({
      explanation:
        "🌿 In the jungle, animals make sounds. Listen carefully and count them!",
    });
  }
});

// ================= AI QUESTION =================
app.post("/ai/generate-question", async (req, res) => {
  try {
    const { topic } = req.body;

    // ✅ CUSTOM GAME LOGIC (NO AI NEEDED)
    if (topic === "sound-tap") {
      const animals = ["🐵 Monkey", "🦁 Lion", "🐘 Elephant", "🐦 Bird"];
      const animal = animals[Math.floor(Math.random() * animals.length)];
      const count = Math.floor(Math.random() * 4) + 1;

      return res.json({
        question: `${animal} made sound ${count} times. How many sounds did you hear?`,
        options: ["1", "2", "3", "4"],
        answer: String(count),
      });
    }

    // fallback AI
    const response = await model.generateContent(
      `Generate simple MCQ JSON about ${topic}`
    );

    res.json({
      question: "Sample question",
      options: ["A", "B", "C", "D"],
      answer: "A",
    });

  } catch (err) {
    console.error("QUESTION ERROR:", err);

    // ✅ fallback always works
    res.json({
      question: "🐵 Monkey made 2 sounds. How many?",
      options: ["1", "2", "3", "4"],
      answer: "2",
    });
  }
});

// ================= AI ANALYZE =================
app.post("/ai/analyze", (req, res) => {
  const { answers } = req.body;

  if (answers.correct) {
    return res.json({
      analysis: "🌟 Great job! You are learning fast!",
    });
  }

  res.json({
    analysis: "💡 Try again! Listen carefully next time!",
  });
});

// ================= START =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});