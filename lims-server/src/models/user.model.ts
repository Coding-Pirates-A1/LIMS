import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "Admin" | "User";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["Admin", "User"], default: "User" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
