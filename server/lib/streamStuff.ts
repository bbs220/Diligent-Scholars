import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY as string;
const apiSecret = process.env.STREAM_API_SECRET as string;

if (!apiKey || !apiSecret) {
  throw new Error(
    "Stream API key and secret must be set in environment variables",
  );
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export interface StreamUser {
  id: string;
  name?: string;
  image?: string;
  [key: string]: any;
}

export const upsertStreamUser = async (
  userdata: StreamUser,
): Promise<StreamUser | undefined> => {
  try {
    await streamClient.upsertUsers([userdata]);

    return userdata;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error upserting Stream user: ${errorMessage}`);
  }
};

export const generateStreamToken = (
  userId: string | { toString: () => string },
): string | undefined => {
  try {
    const userIdStr = userId.toString();

    return streamClient.createToken(userIdStr);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`😭 Error in generating Stream user token: ${errorMessage}`);
  }
};
