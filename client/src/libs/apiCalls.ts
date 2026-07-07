import type {
  typeLogInData,
  typeOnBoardingData,
  typeSignUpData,
} from "../types/typesCollection";
import { axiosInstance } from "./axiosInstance";

// --- MUTATIONS ---
// Returning the full standardized object: { success, message, data }
export const signUpMutationFn = async (signUpData: typeSignUpData) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);
  return res.data;
};

export const logInMutationFn = async (logInData: typeLogInData) => {
  const res = await axiosInstance.post("/auth/login", logInData);
  return res.data;
};

export const logOutMutationFn = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

export const onBoardingMutationFn = async (
  onBoardingData: typeOnBoardingData,
) => {
  const res = await axiosInstance.post("/auth/onboarding", onBoardingData);
  return res.data;
};

export const sendFriendReqFn = async (userId: string) => {
  const res = await axiosInstance.post(`/users/friend-request/${userId}`);
  return res.data;
};

export const acceptFriendReqFn = async (userId: string) => {
  const res = await axiosInstance.put(`/users/friend-request/${userId}/accept`);
  return res.data;
};

// --- QUERIES ---
// Unpacking the standardized object to return only the raw data payload for React Query
export const getAuthUserFn = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data.data.user; // Unpacking data wrapper
  } catch {
    return null;
  }
};

export const populateUserFriendsFn = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data.data.friends || [];
};

export const populateRecommendedUsersFn = async () => {
  const res = await axiosInstance.get("/users");
  return res.data.data.users || [];
};

export const populateOutgoingFriendReqsFn = async () => {
  const res = await axiosInstance.get("/users/outgoing-friend-requests");
  return res.data.data.outgoingReqs || [];
};

export const populateFriendReqsFn = async () => {
  const res = await axiosInstance.get("/users/incoming-friend-requests");
  // This returns an object containing both { incomingReqs, acceptedReqs }
  return res.data.data;
};

export const getStreamToken = async () => {
  const res = await axiosInstance.get("/chat/streamToken");
  return res.data.data.streamToken;
};
