import express from "express";
import {
  login,
  logout,
  onboarding,
  signup,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.post("/onboarding", protectedRoute, onboarding);

router.get("/me", protectedRoute, (req, res) => {
  res.json({ message: "yea youre authenticated", user: req.user });
});
export default router;
