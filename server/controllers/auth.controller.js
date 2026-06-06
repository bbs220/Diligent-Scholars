import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password < 6) {
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

    const newUser = new User.create({
      fullName,
      email,
      password,
      profileAvatar: randomAvatar,
    });
  } catch (error) {
    console.error(`😭 Error in user signin: ${error}`);
  }
};

export const login = async (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user login: ${error}`);
  }
};

export const logout = (req, res) => {
  try {
  } catch (error) {
    console.error(`😭 Error in user logout: ${error}`);
  }
};
