import type { ReactNode } from "react";

export type typeSignUpData = {
  fullName: string;
  email: string;
  password: string;
};

export type typeLogInData = {
  email: string;
  password: string;
};

export type typeOnBoardingData = {
  fullName: string;
  bio: string;
  skillToShare: string;
  skillToLearn: string;
  location: string;
  profileAvatar: string;
};

export type typeLayout = {
  children: ReactNode;
  showSideBar?: boolean;
};

export interface User {
  _id: string;
  fullName: string;
  email: string;
  bio: string;
  profileAvatar: string;
  skillToShare: string;
  skillToLearn: string;
  location: string;
  isOnboarded: boolean;
  friends: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}
