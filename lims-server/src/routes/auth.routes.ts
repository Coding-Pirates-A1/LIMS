import { Router } from "express";
import {
  loginUser,
  registerUser,
  validateToken,
} from "../controllers/auth.controller";

const router = Router();

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/validate
router.get("/validate", validateToken);

export default router;
