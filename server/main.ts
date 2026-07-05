import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./lib/connectDB.js";
import { envValidated } from "./lib/envValidated.js";

import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = envValidated.PORT;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
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
  console.error(`🚨 Global Error: ${err.message || err}`);

  const statusCode = err.status || 500;

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",

    stack: envValidated.NODE_ENV === "production" ? null : err.stack,
  });
});

app.listen(PORT, () => {
  if (envValidated.NODE_ENV === "production") {
    console.log(`🚀 Server and Client started successfully`);
  } else {
    console.log(`🚀 Server started on: http://localhost:${PORT}`);
  }
  connectDB();
});
