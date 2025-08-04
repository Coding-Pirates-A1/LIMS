import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  console.log("Connecting to MongoDB... ", uri);
  if (!uri) throw new Error("MONGO_URI is not defined in .env");

  await mongoose.connect(uri, {
    dbName: process.env.DB_NAME || "inventoryDB",
  });

  console.log("✅ MongoDB connected");
};
