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

export type typeUser = {
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
};

export type typeScholarProfile = typeUser & {
  friendsCount: number;
  relationship: {
    isSelf: boolean;
    isFriend: boolean;
    requestStatus: "none" | "sent" | "received";
    isBlocked?: boolean;
  };
};

export type typeReportData = {
  reason: string;
  details?: string;
};

export type typeChangePasswordData = {
  currentPassword: string;
  newPassword: string;
};

export type typeStudySession = {
  _id: string;
  host: typeUser;
  participant: typeUser;
  title: string;
  subject: string;
  scheduledDate: string;
  durationMinutes: number;
  notes?: string;
  callId: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
};

export type typeCreateSessionData = {
  participantId: string;
  title: string;
  subject: string;
  scheduledDate: string;
  durationMinutes?: number;
  notes?: string;
};

export type typeForgotPasswordData = {
  email: string;
};

export type typeResetPasswordData = {
  token: string;
  newPassword: string;
};
