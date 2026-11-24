import express from "express";
import { protectedRoute } from "../middleware/auth.middleware.js";
import {
  createSession,
  deleteSession,
  getUserSessions,
  updateSessionStatus,
} from "../controllers/session.controller.js";

const router = express.Router();

router.use(protectedRoute);

router.get("/", getUserSessions);
router.post("/", createSession);
router.put("/:id/status", updateSessionStatus);
router.delete("/:id", deleteSession);

export default router;
