import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { envValidated } from "../lib/envValidated.js";
import { upsertStreamUser } from "../lib/streamStuff.js";
import { AuthRequest } from "../middleware/auth.middleware.js";
import { logger } from "../lib/logger.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: envValidated.NODE_ENV === "production",
};

export const signup = async (req: Request, res: Response): Promise<any> => {
  const { fullName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already exists, please use a different email",
      data: null,
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
    logger.info(
      `🤗 Successfully upserted Stream user during signup: ${newUser.fullName}`,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `😭 Error upserting Stream user during signup: ${errorMessage}`,
    );
  }

  // generate both tokens
  const accessToken = jwt.sign(
    { userId: newUser._id },
    envValidated.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { userId: newUser._id },
    envValidated.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // save refresh token to the database
  newUser.refreshToken = refreshToken;
  await newUser.save();

  // set both cookies
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // clean user object to send back
  const userResponse = newUser.toObject();
  delete userResponse.password;
  delete userResponse.refreshToken;

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: {
      user: userResponse,
    },
  });
};

export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }

  const isPasswordCorrect = await user.matchPassword(password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
      data: null,
    });
  }

  // generate both tokens
  const accessToken = jwt.sign(
    { userId: user._id },
    envValidated.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    envValidated.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    },
  );

  // save refresh token to the database
  user.refreshToken = refreshToken;
  await user.save();

  // set both cookies
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: null,
  });
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    const user = await User.findOne({ refreshToken });
    if (user) {
      user.refreshToken = "";
      await user.save();
    }
  }

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
    data: null,
  });
};

export const onboarding = async (
  req: AuthRequest,
  res: Response,
): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  const userId = req.user._id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      ...req.body,
      isOnboarded: true,
    },
    { new: true },
  ).select("-password -refreshToken");

  if (!updatedUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: null,
    });
  }

  try {
    await upsertStreamUser({
      id: updatedUser._id.toString(),
      name: updatedUser.fullName,
      image: updatedUser.profileAvatar || "",
    });
    logger.info(
      `🤗 Successfully updated Stream user during onboarding: ${updatedUser.fullName}`,
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(
      `😭 Error updating Stream user during onboarding: ${errorMessage}`,
    );
  }

  res.status(200).json({
    success: true,
    message: "User onboarded successfully",
    data: {
      user: updatedUser,
    },
  });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<any> => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      data: null,
    });
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: {
      user: req.user,
    },
  });
};
