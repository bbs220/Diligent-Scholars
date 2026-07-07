import { Response } from "express";
import FriendReq from "../models/FriendReq.model.js";
import User from "../models/User.model.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";

export const populateRecommendedUsers = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const currentUserId = req.user._id;
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        // exclude the current user
        { _id: { $ne: currentUserId } },
        // exclude users who are already friends with the current user
        { _id: { $nin: currentUser.friends } },
        // only include users who are onboarded
        { isOnboarded: true },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Recommended users fetched successfully",
      data: { users: recommendedUsers },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error populating recommended users: ${errorMessage}`);

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

export const populateFriends = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "fullName profileAvatar skillToLearn skillToShare");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found", data: null });
    }

    res.status(200).json({
      success: true,
      message: "Friends fetched successfully",
      data: { friends: user.friends },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error populating current user's friends: ${errorMessage}`);

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

export const sendFriendReq = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const myId = req.user.id.toString();
    const { id: receiverId } = req.params;

    if (myId === receiverId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Can't send friend requests to yourself",
          data: null,
        });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res
        .status(404)
        .json({ success: false, message: "Receiver not found", data: null });
    }

    const isAlreadyFriend = receiver.friends.some(
      (friendId: string) => friendId.toString() === myId,
    );

    if (isAlreadyFriend) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are already friends with this user",
          data: null,
        });
    }

    const existingFriendReq = await FriendReq.findOne({
      $or: [
        { sender: myId, receiver: receiverId },
        { sender: receiverId, receiver: myId },
      ],
    });

    if (existingFriendReq) {
      return res.status(400).json({
        success: false,
        message: "A friend request already exists between you and this user",
        data: null,
      });
    }

    const friendReq = await FriendReq.create({
      sender: myId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully",
      data: { friendReq },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error sending friend request: ${errorMessage}`);

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

export const acceptFriendReq = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const { id: requestId } = req.params;

    const friendReq = await FriendReq.findById(requestId);

    if (!friendReq) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Friend request not found",
          data: null,
        });
    }

    if (friendReq.receiver.toString() !== req.user.id.toString()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You are not authorized to accept this request",
          data: null,
        });
    }

    friendReq.reqStatus = "accepted";

    await friendReq.save();

    await User.findByIdAndUpdate(friendReq.sender, {
      $addToSet: { friends: friendReq.receiver },
    });

    await User.findByIdAndUpdate(friendReq.receiver, {
      $addToSet: { friends: friendReq.sender },
    });

    res.status(200).json({
      success: true,
      message: "Friend request accepted",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error accepting friend request: ${errorMessage}`);

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

export const incomingFriendReqs = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const incomingReqs = await FriendReq.find({
      receiver: req.user._id,
      reqStatus: "pending",
    }).populate("sender", "fullName profileAvatar skillToLearn skillToShare");

    const acceptedReqs = await FriendReq.find({
      sender: req.user._id,
      reqStatus: "accepted",
    }).populate("receiver", "fullName profileAvatar");

    res.status(200).json({
      success: true,
      message: "Incoming requests fetched successfully",
      data: { incomingReqs, acceptedReqs },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `😭 Error in observing all incoming friend requests: ${errorMessage}`,
    );

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

export const outgoingFriendReqs = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const outgoingReqs = await FriendReq.find({
      sender: req.user._id,
      reqStatus: "pending",
    }).populate("receiver", "fullName profileAvatar skillToLearn skillToShare");

    res.status(200).json({
      success: true,
      message: "Outgoing requests fetched successfully",
      data: { outgoingReqs },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `😭 Error in observing all outgoing friend requests: ${errorMessage}`,
    );

    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};
