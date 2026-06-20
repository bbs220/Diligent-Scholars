import type { typeSignUpData } from "../types/typesCollection";
import { axiosInstance } from "./axiosInstance";

export const signUpFn = async (signUpData: typeSignUpData) => {
  const res = await axiosInstance.post("/auth/signup", signUpData);

  return res.data;
};
