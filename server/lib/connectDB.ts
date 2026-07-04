import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI as string;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from environment variables!");
    }

    const connectionMongo = await mongoose.connect(mongoUri);

    console.log(`🤗 MongoDB connected at: ${connectionMongo.connection.host}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(`Error trying to connect MongoDB: ${errorMessage}`);

    process.exit(1);
  }
};
