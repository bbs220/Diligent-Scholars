import express from "express";

const router = express.Router();

router.get("/signup", (req, res) => {
  res.status(200).json({ message: "signup route" });
});

router.get("/login", (req, res) => {
  res.status(200).json({ message: "login route" });
});

router.get("/logout", (req, res) => {
  res.status(200).json({ message: "logout route" });
});

export default router;
