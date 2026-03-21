import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";

const router = express.Router();


// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    console.log("Register API hit 🔥");

    const { name, email, password } = req.body;

    console.log(name, email, password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();
    console.log("User saved ✅");

    await sendEmail(email, "Welcome to CurioKids 🎉", name);
    console.log("Email function called 📧");

    res.status(201).json({ message: "User registered successfully ✅" });

  } catch (error) {
    console.log("Register error:", error);
    res.status(500).json({ error: error.message });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found ❌" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password ❌" });
    }

    // 🔐 Generate token (NOW user is defined ✅)
    const token = jwt.sign(
      { id: user._id },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful ✅",
      token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;