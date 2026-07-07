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
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
        data: null,
      });
    }

    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({
      success: true,
      message: "Stream token generated successfully",
      data: { streamToken },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error in getting the stream token: ${errorMessage}`);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};
