import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ================= EMAIL SETUP =================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= OTP STORE =================
const otpStore = {};

// ================= ROOT =================
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ================= SEND OTP =================
app.post("/api/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // 💾 Save OTP
    otpStore[email] = otp;

    console.log("📧 OTP:", otp);

    // 📧 Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      html: `<h2>Your OTP is: ${otp}</h2>`,
    });

    res.json({ success: true });

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// ================= VERIFY OTP =================
app.post("/api/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  console.log("VERIFY:", email, otp);
  console.log("STORED:", otpStore[email]);

  if (otpStore[email] == otp) {
    delete otpStore[email]; // remove after success
    return res.json({ success: true });
  }

  return res.status(400).json({ message: "Invalid OTP ❌" });
});

// ================= CHAT API =================
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "AI error" });
  }
});

// ================= REGISTER =================
app.post("/api/register", (req, res) => {
  try {
    const { name, email, time } = req.body;

    console.log("REGISTER:", name, email, time);

    if (!name || !email) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // 👉 For now just success (no DB yet)
    res.json({
      success: true,
      message: "Registered successfully 🎉"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Register failed" });
  }
});
console.log("✅ SERVER FILE LOADED");

// ================= SERVER =================
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});