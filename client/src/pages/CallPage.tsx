import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../libs/apiCalls";

const CallPage = () => {
  const { id: callId } = useParams<{ id: string }>();

  const [callClient, setCallClient] = useState(null);
  const [call, setCall] = useState(null);
  const [connecting, setConnecting] = useState<boolean>(true);

  const { authUser, isLoading } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const startCall = async () => {};
  }, []);

  return <div>CallPage</div>;
};

export default CallPage;
