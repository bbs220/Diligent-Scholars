import {
  Call,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import CallContent from "../components/CallContent";
import PageLoader from "../components/PageLoader";
import useAuthUser from "../hooks/useAuthUser";
import { getStreamToken } from "../libs/apiCalls";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY as string;

const CallPage = () => {
  const { id: callId } = useParams<{ id: string }>();

  const [callClient, setCallClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const startCall = async () => {
      if (!tokenData?.streamToken || !authUser || !callId) {
        return;
      }

      try {
        const currentUser = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profileAvatar,
        };

        const videoCallClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user: currentUser,
          token: tokenData.streamToken,
        });

        const callInstance = videoCallClient.call("default", callId);

        await callInstance.join({
          create: true,
        });

        setCallClient(videoCallClient);
        setCall(callInstance);
      } catch (error) {
        console.log(`Error in starting a call: ${error}`);

        toast.error("Failed to start a video call. Please try again later");
      } finally {
        setIsConnecting(false);
      }
    };

    startCall();
  }, [authUser, callId, tokenData?.streamToken]);

  if (isLoading || isConnecting) {
    return <PageLoader />;
  }

  return (
    <div className="h-dvh w-full bg-base-200 flex flex-col items-center justify-center font-inter p-0 lg:p-6 xl:p-8">
      <div className="relative w-full h-full bg-base-100 shadow-none lg:shadow-2xl lg:rounded-2xl overflow-hidden max-w-7xl mx-auto flex flex-col">
        {callClient && call ? (
          <StreamVideo client={callClient}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 text-center">
            <p className="font-semibold text-base sm:text-lg opacity-80">
              Could not start the video call. Please try again later!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CallPage;
