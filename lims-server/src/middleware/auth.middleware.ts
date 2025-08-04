import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "@/models/user.model";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await User.findById(decoded.id).select("-password");

    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized access", error: err });
  }
};
