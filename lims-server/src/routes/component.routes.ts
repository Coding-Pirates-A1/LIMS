import express from "express";
import {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
} from "../controllers/component.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", authenticate, getAllComponents);
router.post("/", authenticate, createComponent);
router.get("/:id", authenticate, getComponentById);
router.put("/:id", authenticate, updateComponent);
router.delete("/:id", authenticate, deleteComponent);

export default router;
