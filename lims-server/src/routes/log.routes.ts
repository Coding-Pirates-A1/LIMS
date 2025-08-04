import express from "express";
import { createLog, getLogs } from "../controllers/log.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

// All authenticated users can view logs
router.get("/", authenticate, getLogs);

// All authenticated users can log usage or addition
router.post("/", authenticate, createLog);

export default router;
