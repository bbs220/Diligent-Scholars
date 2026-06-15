import FriendReq from "../models/FriendReq.model.js";
import User from "../models/user.model.js";

export const populateRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const currentUser = req.user;

    const recommendedUsers = await User.find({
      $and: [
        // exclude the current user
        { _id: { $ne: currentUserId } },
        // exclude users who are already friends with the current user
        { $id: { $nin: currentUser.friends } },
        // only include users who are onboarded
        { isOnboarded: true },
      ],
    });

    res.status(200).json({ message: "Recommended Users", recommendedUsers });
  } catch (error) {
    console.error(`😭 Error populating recommended users: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const populateFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profileAvatar skillToLearn skillToShare");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error(`😭 Error populating current user's friends: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendFriendReq = async (req, res) => {
  try {
    const myId = req.user.id;

    const { id: receiverId } = req.params;

    if (myId === receiverId) {
      return res
        .status(400)
        .json({ message: "Can't send friend requests to yourself!" });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (receiver.friends.includes(myId)) {
      return res
        .status(400)
        .json({ message: "You are already friends with this user!" });
    }

    const existingFriendReq = await FriendReq.findOne({
      $or: [
        { sender: myId, receiver: receiverId },
        {
          sender: receiverId,
          receiver: myId,
        },
      ],
    });

    if (existingFriendReq) {
      return res.status(400).json({
        message: "A friend request already exists between you and this user",
      });
    }

    const friendReq = await FriendReq.create({
      sender: myId,
      receiver: receiverId,
    });

    res.status(201).json(friendReq);
  } catch (error) {
    console.error(`😭 Error sending friend request: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const acceptFriendReq = async (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error accepting friend request: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
