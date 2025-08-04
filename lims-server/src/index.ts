import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import componentRoutes from "./routes/component.routes";
import logRoutes from "./routes/log.routes";
// import dashboardRoutes from "./routes/dashboard.routes";
// import notificationRoutes from "./routes/notification.routes";

// import { startNotificationJobs } from "./cron/notificationJobs";
// import { errorHandler } from "./middleware/error.middleware";
import { connectDB } from "./config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/components", componentRoutes);
app.use("/api/logs", logRoutes);
// app.use("/api/dashboard", dashboardRoutes);
// app.use("/api/notifications", notificationRoutes);

// // Error handling middleware
// app.use(errorHandler);

// DB + Server Init
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    // startNotificationJobs();
  })
  .catch((err) => console.error("❌ DB connection error:", err));
