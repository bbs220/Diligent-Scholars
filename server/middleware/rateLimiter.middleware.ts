import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per window
  message: {
    message:
      "Too many attempts from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // returns rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disables the deprecated `X-RateLimit-*` headers
  skip: () => process.env.NODE_ENV !== "production", // bypass the rate limiter in dev
});
