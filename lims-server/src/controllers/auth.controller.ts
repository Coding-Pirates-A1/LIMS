import { Response } from "express";
import User from "../models/user.model";
import { hashPassword, comparePasswords } from "../utils/password";
import { generateToken, verifyToken } from "../utils/jwt";

export const registerUser = async (req: any, res: Response) => {
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

    const token = generateToken({ id: newUser._id, role: newUser.role });

    const userData = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return res.status(201).json({ user: userData, token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during registration", error: err });
  }
};

export const loginUser = async (req: any, res: Response) => {
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
    return res.status(200).json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error during login", error: err });
  }
};

export const validateToken = (req: any, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const payload = verifyToken(token);
    return res.status(200).json({ valid: true, payload });
  } catch (err) {
    return res
      .status(401)
      .json({ valid: false, message: "Invalid token", error: err });
  }
};
