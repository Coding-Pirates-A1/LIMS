// src/models/log.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  _id: mongoose.Types.ObjectId;
  component: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  type: "used" | "added";
  quantity: number;
  purpose?: string;
  createdAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    component: {
      type: Schema.Types.ObjectId,
      ref: "Component",
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["used", "added"], required: true },
    quantity: { type: Number, required: true },
    purpose: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Log = mongoose.model<ILog>("Log", logSchema);
