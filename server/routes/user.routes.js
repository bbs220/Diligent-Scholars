import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  populateFriends,
  populateRecommendedUsers,
  sendFriendReq,
} from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/", populateRecommendedUsers);
router.get("/friends", populateFriends);

router.post("/friend-request/:id", sendFriendReq);

export default router;
