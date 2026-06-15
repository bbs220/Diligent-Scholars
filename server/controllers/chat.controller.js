import { generateStreamToken } from "../lib/streamStuff.js";

export const getStreamToken = async (req, res) => {
  try {
    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({ streamToken });
  } catch (error) {
    console.error(`😭 Error in getting the stream token: ${error}`);

    res.status(500).json({ message: "Internal server error" });
  }
};
