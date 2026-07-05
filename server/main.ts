import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/connectDB.js";
import { envValidated } from "./lib/envValidated.js";

import { logger } from "./lib/logger.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = envValidated.PORT;

const app = express();

// fuckin reverse proxies in prod
// always forget this
app.set("trust proxy", 1); // trust first proxy

// NOTE: Since we serve the frontend via express.static in production, CORS isn't strictly
// necessary there (Same-Origin). However, we configure it dynamically here so the API
// is future-proofed in case we ever host the frontend on a separate domain (like Vercel).
app.use(
  cors({
    origin: envValidated.CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/chat", chatRoutes);

if (envValidated.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));

  app.get(/(.*)/, (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
} else {
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "🌟 API is alive in dev" });
  });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`🚨 Global Error: ${err.message || err}`);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",

    stack: envValidated.NODE_ENV === "production" ? null : err.stack,
  });
});

const server = app.listen(PORT, () => {
  if (envValidated.NODE_ENV === "production") {
    logger.info(`🚀 Server and Client started successfully`);
  } else {
    logger.info(`🚀 Server started on: http://localhost:${PORT}`);
  }
  connectDB();
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`\n${signal} signal received: closing HTTP server...`);

  server.close(async () => {
    logger.info("HTTP server closed. Finishing active requests...");

    try {
      await mongoose.connection.close(false);
      logger.info("MongoDB connection closed.");

      logger.info("Graceful shutdown complete. Exiting process.");
      process.exit(0);
    } catch (error) {
      logger.error(`Error during MongoDB disconnect: ${error}`);
      process.exit(1);
    }
  });

  // if active requests take longer than 10 seconds, force shutdown
  setTimeout(() => {
    logger.error(
      "Could not close connections in time, forcefully shutting down",
    );
    process.exit(1);
  }, 10000);
};

// listen for the universal OS signals
// sent by deployment platforms
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
// sent by Ctrl+C in local terminal
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
