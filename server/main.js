import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";

import authRoutes from "./routes/auth.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

if (process.env.NODE_ENV === "production") {
  console.log(`We are in prod`);
} else {
  app.get("/", (req, res) => {
    res.status(200).json({ message: "🌟 API is alive in dev" });
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server started on: http://localhost:${PORT}`);
});
