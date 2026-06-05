import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connectionMongo = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🤗 MongoDB connected at: ${connectionMongo.connection.host}`);
  } catch (error) {
    console.log(`Error trying to connect MongoDB: ${error}`);

    process.exit(1);
  }
};
