import { Request, Response } from "express";
import User from "@/models/user.model";
import { hashPassword, comparePasswords } from "@/utils/password";
import { generateToken } from "@/utils/jwt";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email or username already exists." });
    }

    const passwordHash = await hashPassword(password);
    const newUser = await User.create({ username, email, passwordHash, role });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during registration", error: err });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePasswords(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user._id, role: user.role });
    return res
      .status(200)
      .json({
        token,
        user: { id: user._id, username: user.username, role: user.role },
      });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during login", error: err });
  }
};
