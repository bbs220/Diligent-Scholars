import { StreamChat } from "stream-chat";
import { envValidated } from "./envValidated.js";
import { logger } from "./logger.js";

const streamClient = StreamChat.getInstance(
  envValidated.STREAM_API_KEY,
  envValidated.STREAM_API_SECRET,
);

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
    logger.error(`😭 Error upserting Stream user: ${errorMessage}`);
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
    logger.error(`😭 Error in generating Stream user token: ${errorMessage}`);
  }
};
