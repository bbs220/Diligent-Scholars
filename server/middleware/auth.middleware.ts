import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserDocument } from "../models/User.model.js";
import { envValidated } from "../lib/envValidated.js";
import { logger } from "../lib/logger.js";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

export const protectedRoute = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
        data: null,
      });
    }

    const decoded = jwt.verify(
      token,
      envValidated.JWT_SECRET_KEY,
    ) as JwtPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid token",
        data: null,
      });
    }

    const user = await User.findById(decoded.userId).select(
      "-password -refreshToken",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
        data: null,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error in protectedRoute middleware: ${errorMessage}`);

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};
