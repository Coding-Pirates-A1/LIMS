// src/controllers/log.controller.ts
import { Request, Response, NextFunction } from "express";
import { Log } from "@/models/log.model";
import Component from "@/models/component.model";
import { createError } from "../utils/error";

export const createLog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { componentId, type, quantity, purpose } = req.body;
    if (!req.user) return next(createError(401, "Unauthorized"));
    const userId = req.user._id;

    const component = await Component.findById(componentId);
    if (!component) return next(createError(404, "Component not found"));

    if (type === "used") {
      if (component.quantity < quantity) {
        return next(createError(400, "Not enough quantity in inventory"));
      }
      component.quantity -= quantity;
    } else if (type === "added") {
      component.quantity += quantity;
    } else {
      return next(createError(400, "Invalid log type"));
    }

    await component.save();

    const log = await Log.create({
      component: componentId,
      user: userId,
      type,
      quantity,
      purpose,
    });

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

export const getLogs = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const logs = await Log.find()
      .populate("component", "partNumber category")
      .populate("user", "name role")
      .sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    next(err);
  }
};
