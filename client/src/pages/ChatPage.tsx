import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../libs/apiCalls";
import { StreamChat, Channel as StreamChannel } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageList,
  Window,
  MessageComposer,
  Thread,
} from "stream-chat-react";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY as string;

const ChatPage = () => {
  const { id: targetUserId } = useParams<{ id: string }>();

  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [chatChannel, setChatChannel] = useState<StreamChannel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const startChat = async () => {
      if (!tokenData?.streamToken || !authUser || !targetUserId) {
        return;
      }

      try {
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profileAvatar,
          },
          tokenData.streamToken,
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
  }, [authUser, targetUserId, tokenData?.streamToken]);

  const handleVideoCall = () => {
    if (chatChannel) {
      const callURL = `${window.location.origin}/call/${chatChannel.id}`;

      chatChannel.sendMessage({
        text: `Started a video call at ${callURL}`,
      });

      toast.success("Video call started! Share the link with your friend");
    }
  };

  if (loading || !chatClient || !chatChannel) {
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh]">
      <Chat client={chatClient}>
        <Channel channel={chatChannel}>
          <div className="w-full h-full relative">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageComposer focus />
            </Window>
          </div>
          <Thread />
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;
