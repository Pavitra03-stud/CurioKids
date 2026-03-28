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

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists, please login 🔐",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
      isVerified: false,
    });

    await user.save();
    console.log("User created ✅");

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


// ================= LOGIN (SEND OTP ONLY) =================
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Login OTP request 🔐", email);

    if (!email) {
      return res.status(400).json({
        message: "Email is required 📧",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please register 🌱",
      });
    }

    // ✅ IMPORTANT: NO isVerified check here

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("LOGIN OTP:", otp);

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent for login 🔐",
    });

  } catch (error) {
    console.log("Login OTP error:", error);
    res.status(500).json({ error: error.message });
  }
});


// ================= VERIFY OTP =================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log("Incoming body:", req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found ❌" });
    }

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

    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful 🎉",
      token,
    });

  } catch (error) {
    console.log("OTP error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;