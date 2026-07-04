import express, { Request, Response } from "express";
import {
  login,
  logout,
  onboarding,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { UserDocument } from "../models/User.model.js";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboarding);

// Explicitly type req and res so TS knows req.user exists
router.get("/me", protectedRoute, (req: AuthRequest, res: Response) => {
  res.json({ message: "yea youre authenticated", user: req.user });
});

export default router;
