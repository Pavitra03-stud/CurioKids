import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // 🔥 VERY IMPORTANT
  auth: {
    user: "curiokids25@gmail.com",
    pass: "lyqonrzxpsaltmhu",
  },
});

// 🔐 Send OTP
export const sendOtpEmail = async (to, otp) => {
  try {
    await transporter.sendMail({
      from: "curiokids25@gmail.com",
      to,
      subject: "Your OTP Code 🔐",
      text: `Your OTP is ${otp}. It expires in 2 minutes.`,
    });

    console.log("✅ OTP Email sent!");
  } catch (error) {
    console.log("❌ OTP Email error:", error);
  }
};

// 🎉 Send Welcome Mail
export const sendWelcomeEmail = async (to, name) => {
  try {
    await transporter.sendMail({
      from: "curiokids25@gmail.com",
      to,
      subject: "Welcome to CurioKids 🌱",
      html: `
        <h2>Hi ${name} 👋</h2>
        <p>Welcome to <b>CurioKids</b> 🎉</p>
        <p>Your child’s learning journey starts now 🚀</p>
      `,
    });

    console.log("✅ Welcome Email sent!");
  } catch (error) {
    console.log("❌ Welcome Email error:", error);
  }
};