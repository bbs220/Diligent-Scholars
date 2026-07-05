import axios from "axios";
import { coreRouter } from "../coreRouter";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api/v1"
    : "/api/v1";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/signup";

      if (!isAuthPage) {
        coreRouter.navigate("/login");
      }
    }
    return Promise.reject(error);
  },
);
