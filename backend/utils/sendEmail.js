import nodemailer from "nodemailer";

const sendEmail = async (to, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "curiokids25@gmail.com",
        pass: "emawcoxylkqiimhc", // 🔐 paste app password here
      },
    });

    const mailOptions = {
      from: "curiokids25@gmail.com",
      to: to, // ✅ dynamic user email
      subject: "Welcome to CurioKids 🌱",
      html: `
        <h2>Hi ${name} 👋</h2>
        <p>Welcome to <b>CurioKids</b> 🎉</p>
        <p>Your child’s learning journey starts now 🚀</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent!");
  } catch (error) {
    console.log("❌ Email error:", error);
  }
};

export default sendEmail;