import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists, please use a different email",
      });
    }

    const idx = Math.floor(Math.random() * 100) + 1;

    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      fullName,
      email,
      password,
      profileAvatar: randomAvatar,
    });

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true, // stops XSS attacks by preventing client-side access to the cookie
      sameSite: "strict", // stops CSRF attacks by only sending the cookie for same-site requests
      secure: process.env.NODE_ENV === "production", // ensures the cookie is only sent over HTTPS in production
    });

    res.status(201).json({
      message: "User created successfully",
      // remove this part later in prod
      newUser,
    });
  } catch (error) {
    console.error(`😭 Error in user signin: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user login: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user logout: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
