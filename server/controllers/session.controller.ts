import { Response } from "express";
import Session from "../models/Session.model.js";
import User from "../models/User.model.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";

// create new study session
export const createSession = async (
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

    const {
      participantId,
      title,
      subject,
      scheduledDate,
      durationMinutes,
      notes,
    } = req.body;

    if (!participantId || !title || !subject || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: "Participant title subject and scheduled date are required",
        data: null,
      });
    }

    const currentUserId = req.user.id.toString();
    if (currentUserId === participantId) {
      return res.status(400).json({
        success: false,
        message: "You cannot schedule a study session with yourself",
        data: null,
      });
    }

    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Partner scholar not found",
        data: null,
      });
    }

    const parsedDate = new Date(scheduledDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid scheduled date format",
        data: null,
      });
    }

    const callId = [currentUserId, participantId].sort().join("-");

    const newSession = await Session.create({
      host: req.user._id,
      participant: participantId,
      title,
      subject,
      scheduledDate: parsedDate,
      durationMinutes: durationMinutes || 45,
      notes: notes || "",
      callId,
      status: "scheduled",
    });

    const sessionId = (newSession as any)._id;
    const populatedSession = await Session.findById(sessionId)
      .populate("host", "fullName profileAvatar skillToShare skillToLearn")
      .populate("participant", "fullName profileAvatar skillToShare skillToLearn");

    res.status(201).json({
      success: true,
      message: "Study session scheduled successfully",
      data: {
        session: populatedSession,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error creating study session: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// get study sessions for current user
export const getUserSessions = async (
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

    const currentUserId = req.user._id;

    const sessions = await Session.find({
      $or: [{ host: currentUserId }, { participant: currentUserId }],
    } as any)
      .populate("host", "fullName profileAvatar skillToShare skillToLearn")
      .populate("participant", "fullName profileAvatar skillToShare skillToLearn")
      .sort({ scheduledDate: 1 });

    res.status(200).json({
      success: true,
      message: "Study sessions fetched successfully",
      data: {
        sessions,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error fetching study sessions: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// update study session status
export const updateSessionStatus = async (
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

    const { id } = req.params;
    const { status } = req.body;

    if (!status || !["scheduled", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required",
        data: null,
      });
    }

    const currentUserId = req.user.id.toString();
    const session = await Session.findById(id);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found",
        data: null,
      });
    }

    const isHost = session.host.toString() === currentUserId;
    const isParticipant = session.participant.toString() === currentUserId;

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this session",
        data: null,
      });
    }

    session.status = status;
    await session.save();

    const updatedSession = await Session.findById(id)
      .populate("host", "fullName profileAvatar skillToShare skillToLearn")
      .populate("participant", "fullName profileAvatar skillToShare skillToLearn");

    res.status(200).json({
      success: true,
      message: "Session status updated successfully",
      data: {
        session: updatedSession,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error updating study session status: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// delete or cancel study session
export const deleteSession = async (
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

    const { id } = req.params;
    const currentUserId = req.user.id.toString();

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Study session not found",
        data: null,
      });
    }

    const isHost = session.host.toString() === currentUserId;
    const isParticipant = session.participant.toString() === currentUserId;

    if (!isHost && !isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this session",
        data: null,
      });
    }

    await Session.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Study session deleted successfully",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error deleting study session: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};
