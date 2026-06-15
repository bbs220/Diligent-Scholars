import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import { connectDB } from "./lib/connectDB.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

if (process.env.NODE_ENV === "production") {
  console.log(`We are in prod`);
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "🌟 API is alive in dev" });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server started on: http://localhost:${PORT}`);
  connectDB();
});
