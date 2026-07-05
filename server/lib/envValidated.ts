import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),

  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGO_URI: z.url({ error: "MONGO_URI must be a valid URL" }),

  JWT_SECRET_KEY: z
    .string()
    .min(10, { error: "JWT_SECRET_KEY must be at least 10 characters" }),

  STREAM_API_KEY: z.string().min(1, { error: "STREAM_API_KEY is required" }),

  STREAM_API_SECRET: z
    .string()
    .min(1, { error: "STREAM_API_SECRET is required" }),

  CLIENT_URL: z.url({ error: "CLIENT_URL must be a valid URL" }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("❌ Invalid or missing environment variables:");

  console.error(z.treeifyError(parsedEnv.error));

  process.exit(1);
}

export const envValidated = parsedEnv.data;
