import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
