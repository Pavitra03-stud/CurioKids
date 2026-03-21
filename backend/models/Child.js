import mongoose from "mongoose";

const childSchema = new mongoose.Schema({
  name: String,
  age: Number,
  avatar: String,

  // 🔗 Link to parent
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

export default mongoose.model("Child", childSchema);