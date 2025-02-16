import mongoose from "mongoose";

const blackListTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: new Date(),
      expires: 3600,
    },
  },
  { timestamps: true }
);

export  default mongoose.model("backListTokens",blackListTokenSchema)