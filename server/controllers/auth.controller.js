import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { upsertStreamUser } from "../lib/streamStuff.js";

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

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profileAvatar || "",
      });
      console.log(
        `🤗 Successfully upserted Stream user during signup: ${newUser.fullName}`,
      );
    } catch (error) {
      console.error(`😭 Error upserting Stream user during signup: ${error}`);
    }

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = await user.matchPassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "User logged in successfully",
    });
  } catch (error) {
    console.error(`😭 Error in user login: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(`😭 Error in user logout: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const onboarding = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, skillToShare, skillToLearn, location } = req.body;

    if (!fullName || !bio || !skillToShare || !skillToLearn || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !skillToShare && "skillToShare",
          !skillToLearn && "skillToLearn",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User onboarded successfully",
      // remove this part later in prod
      user: updatedUser,
    });
  } catch (error) {
    console.error(`😭 Error in user onboarding: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
