import { Response } from "express";
import { generateStreamToken } from "../lib/streamStuff.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";

export const getStreamToken = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({ streamToken });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error in getting the stream token: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
