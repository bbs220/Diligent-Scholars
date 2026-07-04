import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { upsertStreamUser } from "../lib/streamStuff.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const signup = async (req: Request, res: Response): Promise<any> => {
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

    const randomAvatar = `https://api.dicebear.com/10.x/thumbs/svg?borderRadius=6&backgroundColorFill=linear&seed=${idx}`;

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
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `😭 Error upserting Stream user during signup: ${errorMessage}`,
      );
    }

    const secret = process.env.JWT_SECRET_KEY as string;

    const token = jwt.sign({ userId: newUser._id }, secret, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in user signin: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
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

    const secret = process.env.JWT_SECRET_KEY as string;

    const token = jwt.sign({ userId: user._id }, secret, {
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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in user login: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response): any => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in user logout: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};

export const onboarding = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profileAvatar || "",
      });
      console.log(
        `🤗 Successfully updated Stream user during onboarding: ${updatedUser.fullName}`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error(
        `😭 Error updating Stream user during onboarding: ${errorMessage}`,
      );
    }

    res.status(200).json({
      message: "User onboarded successfully",
      user: updatedUser,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in user onboarding: ${errorMessage}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
