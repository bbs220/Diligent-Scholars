import type { typeSignUpData } from "../types/typesCollection";
import { axiosInstance } from "./axiosInstance";

// this is for mutate
export const signUpFn = async (signUpData: typeSignUpData) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);

  return res.data;
};

// this is not a mutate fu
// this is for query fn
export const getAuthUserFn = async () => {
  const res = await axiosInstance.get("/auth/me");

  return res.data;
};
