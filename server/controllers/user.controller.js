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
  } catch (error) {
    console.error(`😭 Error sending friend request: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
