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
