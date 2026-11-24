import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendReq,
  incomingFriendReqs,
  outgoingFriendReqs,
  populateFriends,
  populateRecommendedUsers,
  sendFriendReq,
  updateProfile,
  getUserProfile,
  cancelFriendReq,
  removeFriend,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/", populateRecommendedUsers);
router.get("/friends", populateFriends);
router.delete("/friends/:id", removeFriend);
router.put("/profile", updateProfile);
router.get("/profile/:id", getUserProfile);

router.post("/friend-request/:id", sendFriendReq);
router.delete("/friend-request/:id", cancelFriendReq);
router.put("/friend-request/:id/accept", acceptFriendReq);

router.get("/incoming-friend-requests", incomingFriendReqs);
router.get("/outgoing-friend-requests", outgoingFriendReqs);

export default router;
