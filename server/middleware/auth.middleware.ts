import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/User.model.js";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const protectedRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const secret = process.env.JWT_SECRET_KEY as string;

    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in protectedRoute middleware: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
