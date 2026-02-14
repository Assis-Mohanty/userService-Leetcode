import mongoose, { Document } from "mongoose";

export interface IRefreshToken extends Document {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  revoked: boolean;
}


const refreshTokenSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tokenHash: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  revoked: { type: Boolean, default: false }
}, { timestamps: true });

export const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
