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

// variables to hold pending requests while the token is refreshing
let isRefreshing = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let failedQueue: any[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // check if the error is a 401 Unauthorized AND we haven't already retried this request
    if (error.response?.status === 401 && !originalRequest._retry) {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/signup";

      // prevent infinite loops on auth routes
      if (
        originalRequest.url.includes("/auth/login") ||
        originalRequest.url.includes("/auth/refresh") ||
        isAuthPage
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // if a refresh is already happening, queue this request until it finishes
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // silently request a new access token
        await axiosInstance.get("/auth/refresh");

        isRefreshing = false;
        processQueue(null);

        // retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // if the refresh token is also dead, kick them to login
        isRefreshing = false;
        processQueue(refreshError, null);
        coreRouter.navigate("/login");
        return Promise.reject(refreshError);
      }
    }

    // standardize backend errors for the frontend UI (e.g. for React Hot Toast)
    const errorMessage =
      error.response?.data?.message || "An unexpected error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);
