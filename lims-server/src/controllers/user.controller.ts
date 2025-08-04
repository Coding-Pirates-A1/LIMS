import { Response } from "express";
import User from "../models/user.model";

// Get all users (admin only)
export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find({}, "-passwordHash");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Get single user by ID
export const getUserById = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id, "-passwordHash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch user", error });
  }
};

// Delete user by ID (admin only)
export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete user", error });
  }
};
