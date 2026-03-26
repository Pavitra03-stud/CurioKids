import express from "express";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

let otpStore = {};

// ✅ SEND OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required ❌" });
  }

  // 🔥 FIXED (string)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expiresAt = Date.now() + 2 * 60 * 1000;

  otpStore[email] = { otp, expiresAt };

  try {
    await sendOtpEmail(email, otp);

    console.log("Generated OTP:", otp); // debug

    res.json({ message: "OTP sent 📧" });
  } catch (error) {
    console.log("OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP ❌" });
  }
});

// ✅ VERIFY OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const record = otpStore[email];

  if (!record) {
    return res.status(400).json({ message: "No OTP found ❌" });
  }

  // ⏳ Expiry
  if (Date.now() > record.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ message: "OTP expired ⏳" });
  }

  // 🔥 DEBUG (VERY IMPORTANT)
  console.log("Entered OTP:", otp);
  console.log("Stored OTP:", record.otp);

  // 🔥 FIXED comparison
  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP ❌" });
  }

  // ✅ Success
  delete otpStore[email];

  try {
    await sendWelcomeEmail(email, "Parent");

    res.json({ message: "OTP verified 🎉" });
  } catch (error) {
    console.log("Welcome mail error:", error);
    res.json({ message: "OTP verified but email failed" });
  }
});

export default router;