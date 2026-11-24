import { Response } from "express";
import FriendReq from "../models/FriendReq.model.js";
import User from "../models/User.model.js";
import Report from "../models/Report.model.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";
import { upsertStreamUser } from "../lib/streamStuff.js";

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

    const blockedUsers = currentUser.blockedUsers || [];
    const usersWhoBlockedMe = await User.find({ blockedUsers: currentUserId }).select("_id");
    const blockedByOthersIds = usersWhoBlockedMe.map((u) => u._id);

    const excludedIds = [
      currentUserId,
      ...currentUser.friends,
      ...blockedUsers,
      ...blockedByOthersIds,
    ];

    const recommendedUsers = await User.find({
      $and: [
        // exclude the current user
        { _id: { $ne: currentUserId } },
        // exclude users who are already friends with the current user
        { _id: { $nin: currentUser.friends } },
        { _id: { $nin: excludedIds } },
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
      .populate("friends", "fullName profileAvatar skillToLearn skillToShare location bio");

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

// update user profile
export const updateProfile = async (
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

    const { fullName, bio, skillToShare, skillToLearn, location, profileAvatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        fullName,
        bio,
        skillToShare,
        skillToLearn,
        location,
        profileAvatar,
      },
      { new: true },
    ).select("-password -refreshToken");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profileAvatar || "",
      });
      logger.info(`🤗 Successfully synced Stream user profile: ${updatedUser.fullName}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`😭 Error syncing Stream user profile: ${errorMessage}`);
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error updating profile: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// cancel outgoing friend request
export const cancelFriendReq = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const { id } = req.params;
    const currentUserId = req.user.id.toString();

    // allow cancelling either by receiver id or by friend request id
    const deletedReq = await FriendReq.findOneAndDelete({
      $and: [
        { sender: currentUserId },
        { reqStatus: "pending" },
        {
          $or: [{ _id: id }, { receiver: id }],
        },
      ],
    });

    if (!deletedReq) {
      return res.status(404).json({
        success: false,
        message: "Pending friend request not found",
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Friend request cancelled successfully",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error cancelling friend request: ${errorMessage}`);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

// remove existing friend
export const removeFriend = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized", data: null });
    }

    const { id: friendId } = req.params;
    const currentUserId = req.user.id.toString();

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { friends: friendId },
    });

    await User.findByIdAndUpdate(friendId, {
      $pull: { friends: currentUserId },
    });

    // remove any friend request records between both users
    await FriendReq.deleteMany({
      $or: [
        { sender: currentUserId, receiver: friendId },
        { sender: friendId, receiver: currentUserId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "Friend removed successfully",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error removing friend: ${errorMessage}`);
    res
      .status(500)
      .json({ success: false, message: "Internal server error", data: null });
  }
};

// block another user
export const blockUser = async (
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

    const { id: targetUserId } = req.params;
    const currentUserId = req.user.id.toString();

    if (currentUserId === targetUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot block yourself",
        data: null,
      });
    }

    // add to blocked users
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { blockedUsers: targetUserId },
      $pull: { friends: targetUserId },
    });

    // remove current user from target friends
    await User.findByIdAndUpdate(targetUserId, {
      $pull: { friends: currentUserId },
    });

    // delete any friend requests between them
    await FriendReq.deleteMany({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId },
      ],
    });

    res.status(200).json({
      success: true,
      message: "User blocked successfully",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error blocking user: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// unblock a user
export const unblockUser = async (
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

    const { id: targetUserId } = req.params;
    const currentUserId = req.user.id.toString();

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: targetUserId },
    });

    res.status(200).json({
      success: true,
      message: "User unblocked successfully",
      data: null,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error unblocking user: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// get all users blocked by current user
export const getBlockedUsers = async (
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

    const currentUserId = req.user.id.toString();
    const user = await User.findById(currentUserId)
      .populate(
        "blockedUsers",
        "fullName profileAvatar skillToShare skillToLearn location",
      )
      .select("blockedUsers");

    res.status(200).json({
      success: true,
      message: "Blocked users fetched successfully",
      data: {
        blockedUsers: user?.blockedUsers || [],
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error fetching blocked users: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// report a user for safety violations
export const reportUser = async (
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

    const { id: reportedUserId } = req.params;
    const { reason, details } = req.body;
    const reporterId = req.user.id.toString();

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Reason is required to submit a report",
        data: null,
      });
    }

    const report = await Report.create({
      reporter: reporterId,
      reportedUser: reportedUserId,
      reason,
      details: details || "",
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully. Our team will review it.",
      data: { report },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error reporting user: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};

// get single scholar profile with relationship status
export const getUserProfile = async (
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

    const { id: targetUserId } = req.params;
    const currentUserId = req.user.id.toString();

    const targetUser = await User.findById(targetUserId).select(
      "-password -refreshToken -email",
    );

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "Scholar not found",
        data: null,
      });
    }

    const isSelf = currentUserId === targetUserId;
    const isFriend = req.user.friends?.some(
      (f: any) => f.toString() === targetUserId,
    );

    let requestStatus = "none";
    if (!isSelf && !isFriend) {
      const pendingReq = await FriendReq.findOne({
        $or: [
          { sender: currentUserId, receiver: targetUserId, reqStatus: "pending" },
          { sender: targetUserId, receiver: currentUserId, reqStatus: "pending" },
        ],
      });

      if (pendingReq) {
        requestStatus =
          pendingReq.sender.toString() === currentUserId ? "sent" : "received";
      }
    }

    res.status(200).json({
      success: true,
      message: "Scholar profile fetched successfully",
      data: {
        user: {
          ...targetUser.toObject(),
          friendsCount: targetUser.friends?.length || 0,
          relationship: {
            isSelf,
            isFriend,
            requestStatus,
            isBlocked: Boolean(req.user.blockedUsers?.some((b: any) => b.toString() === targetUserId)),
          },
        },
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`😭 Error fetching scholar profile: ${errorMessage}`);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      data: null,
    });
  }
};
