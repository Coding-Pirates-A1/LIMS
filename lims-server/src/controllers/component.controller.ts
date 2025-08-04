import { Response } from "express";
import Component from "../models/component.model";

export const createComponent = async (req: any, res: Response) => {
  try {
    const component = await Component.create({
      ...req.body,
      createdBy: req.user?._id,
    });
    return res.status(201).json(component);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to create component", error });
  }
};

export const getAllComponents = async (_req: any, res: Response) => {
  try {
    const components = await Component.find().sort({ createdAt: -1 });
    return res.json(components);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch components", error });
  }
};

export const getComponentById = async (req: any, res: Response) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) {
      return res.status(404).json({ message: "Component not found" });
    }
    return res.json(component);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to fetch component", error });
  }
};

export const updateComponent = async (req: any, res: Response) => {
  try {
    const updated = await Component.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ message: "Component not found" });
    }
    return res.json(updated);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update component", error });
  }
};

export const deleteComponent = async (req: any, res: Response) => {
  try {
    const deleted = await Component.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Component not found" });
    }
    return res.json({ message: "Component deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to delete component", error });
  }
};
