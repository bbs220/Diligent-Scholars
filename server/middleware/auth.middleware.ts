import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { upsertStreamUser } from "../lib/streamStuff.js";
import { envValidated } from "../lib/envValidated.js";
import { AuthRequest } from "../routes/auth.routes.js";

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { fullName, email, password } = req.body;

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `😭 Error upserting Stream user during signup: ${errorMessage}`,
    );
  }

  const token = jwt.sign({ userId: newUser._id }, envValidated.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: envValidated.NODE_ENV === "production",
  });

  res.status(201).json({
    message: "User created successfully",
    newUser,
  });
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ userId: user._id }, envValidated.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: envValidated.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "User logged in successfully",
  });
};

export const logout = (req: Request, res: Response): any => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
    secure: envValidated.NODE_ENV === "production",
  });

  res.status(200).json({ message: "User logged out successfully" });
};

export const onboarding = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.user._id;

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
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `😭 Error updating Stream user during onboarding: ${errorMessage}`,
    );
  }

  res.status(200).json({
    message: "User onboarded successfully",
    user: updatedUser,
  });
};
