import express from "express";
import {
  login,
  logout,
  onboarding,
  signup,
  getMe,
  refresh,
  changePassword,
  deleteAccount,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { authLimiter } from "../middleware/rateLimiter.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { UserDocument } from "../models/User.model.js";
import {
  loginSchema,
  onboardingSchema,
  signupSchema,
} from "../schemas/auth.schema.js";

export interface AuthRequest extends Request {
  user?: UserDocument;
}

const router = express.Router();

// validated and rate limited routes for auth
router.post("/signup", authLimiter, validate(signupSchema), signup);
router.post("/login", authLimiter, validate(loginSchema), login);

// does not need anything
router.post("/logout", logout);

// same as above but with protected and validated route
router.post(
  "/onboarding",
  validate(onboardingSchema),
  protectedRoute,
  onboarding,
);

// get info about logged in user
router.get("/me", protectedRoute, getMe);

// refresh the 15min token
router.get("/refresh", refresh);

// change password for authenticated user
router.put("/change-password", protectedRoute, changePassword);

// delete account for authenticated user
router.delete("/delete-account", protectedRoute, deleteAccount);

export default router;
