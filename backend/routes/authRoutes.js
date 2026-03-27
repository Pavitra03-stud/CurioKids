import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOtpEmail, sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

// ================= REGISTER (SEND OTP) =================
router.post("/register", async (req, res) => {
  try {
    console.log("Register API hit 🔥");

    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields required ❌" });
    }

    // 🔍 Check if user exists
    let user = await User.findOne({ email });

    // 🔐 Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (user) {
      // 🔁 Update existing user
      user.name = name;
      user.otp = otp;
      user.otpExpires = Date.now() + 5 * 60 * 1000;
    } else {
      // 🔒 Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      user = new User({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpires: Date.now() + 5 * 60 * 1000,
        isVerified: false,
      });
    }

    await user.save();
    console.log("User saved / updated ✅");

    // 📧 Send OTP email
    await sendOtpEmail(email, otp);
    console.log("OTP Email sent 📧");

    res.status(200).json({
      message: "OTP sent to email 📧",
    });

  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================= VERIFY OTP =================
// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Incoming body:", req.body); // 🔍 DEBUG

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found ❌" });
    }

    // 🔥 FORCE STRING (IMPORTANT)
    const enteredOtp = String(otp).trim();
    const storedOtp = String(user.otp).trim();

    console.log("Entered OTP:", enteredOtp);
    console.log("Stored OTP:", storedOtp);

    if (storedOtp !== enteredOtp) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired ⏰" });
    }

    // ✅ Mark verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    await sendWelcomeEmail(email, user.name);

    res.json({
      message: "Email verified successfully ✅",
    });

  } catch (error) {
    console.log("OTP error:", error);
    res.status(500).json({ error: error.message });
  }
});
// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    // ❌ Block if not verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first 📧",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token,
    });

  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;