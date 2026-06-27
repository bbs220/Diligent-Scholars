import type {
  typeLogInData,
  typeOnBoardingData,
  typeSignUpData,
} from "../types/typesCollection";
import { axiosInstance } from "./axiosInstance";

// this is for mutate
export const signUpMutationFn = async (signUpData: typeSignUpData) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);

  return res.data;
};

// this is for mutate
export const logInMutationFn = async (logInData: typeLogInData) => {
  const res = await axiosInstance.post("/auth/login", logInData);

  return res.data;
};

// this is for mutate
export const logOutMutationFn = async () => {
  const res = await axiosInstance.post("/auth/logout");

  return res.data;
};

// another mutation fn
export const onBoardingMutationFn = async (
  onBoardingData: typeOnBoardingData,
) => {
  const res = await axiosInstance.post("/auth/onboarding", onBoardingData);

  return res.data;
};

// this is not a mutate fu
// this is for query fn
export const getAuthUserFn = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log(`😭 Error in getting auth user: ${error}`);
    return null;
  }
};

// query fn
export const populateUserFriends = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

// query fn
export const populateRecommendedUsers = async () => {
  const res = await axiosInstance.get("/users");
  return res.data;
};
