import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  deleteUser,
} from "@/controllers/user.controller";

const router = Router();

router.get("/", getAllUsers); // GET /api/users
router.get("/:id", getUserById); // GET /api/users/:id
router.delete("/:id", deleteUser); // DELETE /api/users/:id

export default router;
