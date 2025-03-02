import mongoose from "mongoose";

const ridesSchema = new mongoose.Schema({
  captain: {
    // required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  user: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "initialize",
    enum: ["initialize", "accepted", "completed", "started", "cancelled"],
  },
});

export default mongoose.model("rides", ridesSchema);
