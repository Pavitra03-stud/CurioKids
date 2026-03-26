import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,

  otp: String,
  otpExpires: Date,
  isVerified: {
    type: Boolean,
    default: false
  } 
});

export default mongoose.model("User", userSchema);