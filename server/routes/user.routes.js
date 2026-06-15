import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  acceptFriendReq,
  incomingFriendReqs,
  outgoingFriendReqs,
  populateFriends,
  populateRecommendedUsers,
  sendFriendReq,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/", populateRecommendedUsers);
router.get("/friends", populateFriends);

router.post("/friend-request/:id", sendFriendReq);
router.put("/friend-request/:id/accept", acceptFriendReq);
router.get("/friend-requests", incomingFriendReqs);
router.get("/outgoing-friend-requests", outgoingFriendReqs);

export default router;
