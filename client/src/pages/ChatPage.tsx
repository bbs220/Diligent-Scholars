import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../libs/apiCalls";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";

const STREAM_API_KEY = import.meta.env.STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const startChat = async () => {
      if (!tokenData?.token || !authUser) {
        return;
      }
      try {
        console.log(`Starting chat with token...`);
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profileAvatar,
          },
          tokenData.token,
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");

        const currentChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currentChannel.watch();

        setChatClient(client);
        setChatChannel(currentChannel);
      } catch (error) {
        console.log(`Error starting chat: ${error}`);
        toast.error("Failed to start chat. Please try again later");
      } finally {
        setLoading(false);
      }
    };

    startChat();
  }, []);

  if (loading || !chatClient || !chatChannel) {
    return <ChatLoader />;
  }
  return <div>ChatPage</div>;
};

export default ChatPage;
