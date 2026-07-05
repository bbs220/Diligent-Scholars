import mongoose from "mongoose";
import { envValidated } from "./envValidated.js";
import { logger } from "./logger.js";

export const connectDB = async (): Promise<void> => {
  try {
    const connectionMongo = await mongoose.connect(envValidated.MONGO_URI);

    logger.info(`🤗 MongoDB connected at: ${connectionMongo.connection.host}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.info(`😭 Error trying to connect MongoDB: ${errorMessage}`);

    process.exit(1);
  }
};
