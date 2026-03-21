import nodemailer from "nodemailer";

const sendEmail = async (to, subject, name) => {
  try {
    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gvpavitraganesh@gmail.com",       // your email
        pass: "vguxjhgpibcdljhh"                 // your app password (no spaces)
      }
    });

    // ✅ Send email
    await transporter.sendMail({
      from: "CurioKids <gvpavitraganesh@gmail.com>",
      to,
      subject,

      // ✅ HTML Professional Email
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          
          <h2 style="color: #4CAF50;">Welcome to CurioKids 🎉</h2>
          
          <p>Hi <b>${name}</b> 👋,</p>
          
          <p>
            Welcome to <b>CurioKids</b> — where learning becomes fun and interactive for children! 🚀
          </p>
          
          <p>
            We’re excited to have you on board. Your child’s learning journey starts here ✨
          </p>

          <hr style="margin: 20px 0;" />

          <p style="font-size: 14px; color: gray;">
            If you have any questions, feel free to reach out anytime.
          </p>

          <p><b>– Team CurioKids 💛</b></p>
        </div>
      `
    });

    console.log("Email sent ✅");

  } catch (error) {
    console.log("Email error:", error);
  }
};

export default sendEmail;