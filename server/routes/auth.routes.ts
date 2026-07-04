import express, { Request, Response } from "express";
import {
  login,
  logout,
  onboarding,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { UserDocument } from "../models/User.model.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  onboardingSchema,
  signupSchema,
} from "../schemas/auth.schema.js";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

const router = express.Router();

router.post("/signup", validate(signupSchema), signup);

router.post("/login", validate(loginSchema), login);

router.post("/logout", logout);

router.post(
  "/onboarding",
  validate(onboardingSchema),
  protectedRoute,
  onboarding,
);

router.get("/me", protectedRoute, (req: AuthRequest, res: Response) => {
  res.json({ message: "yea youre authenticated", user: req.user });
});

export default router;
