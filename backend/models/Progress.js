import mongoose from "mongoose";

const progressSchema = new mongoose.Schema({
  child: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true
  },
  game: {
    type: String,
    required: true
  },
  score: Number,
  completed: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Progress", progressSchema);