import { useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { StreamChat } from "stream-chat";
import useAuthUser from "./useAuthUser";
import { getStreamToken } from "../libs/apiCalls";
import { usePresenceStore } from "../stores/usePresenceStore";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY as string;

// stream presence event type
type PresenceEvent = {
  user?: {
    id?: string;
    online?: boolean;
    last_active?: string;
  };
};

// stream connection event type
type ConnectionEvent = {
  online?: boolean;
};

// hook to initialize stream presence and sync online statuses
export const useStreamPresence = () => {
  const { authUser } = useAuthUser();
  const {
    isClientConnected,
    setClientConnected,
    setUserOnline,
    setBatchUsersPresence,
    isUserOnline,
    getUserLastActive,
  } = usePresenceStore();

  const { data: streamToken } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: Boolean(authUser && authUser.isOnboarded),
  });

  const clientRef = useRef<StreamChat | null>(null);

  useEffect(() => {
    if (!authUser || !authUser.isOnboarded || !streamToken || !STREAM_API_KEY) {
      return;
    }

    let isMounted = true;
    const client = StreamChat.getInstance(STREAM_API_KEY);
    clientRef.current = client;

    // connect current user if not already connected
    const connect = async () => {
      try {
        if (!client.userID || client.userID !== authUser._id) {
          await client.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profileAvatar || "",
            },
            streamToken,
          );
        }
        if (isMounted) {
          setClientConnected(true);
        }
      } catch {
        if (isMounted) {
          setClientConnected(false);
        }
      }
    };

    connect();

    // event handler for presence change
    const handlePresenceChanged = (event: PresenceEvent) => {
      if (event.user?.id) {
        setUserOnline(
          event.user.id,
          Boolean(event.user.online),
          event.user.last_active,
        );
      }
    };

    // event handler for user profile or status update
    const handleUserUpdated = (event: PresenceEvent) => {
      if (event.user?.id) {
        setUserOnline(
          event.user.id,
          Boolean(event.user.online),
          event.user.last_active,
        );
      }
    };

    // event handler for connection state change
    const handleConnectionChanged = (event: ConnectionEvent) => {
      setClientConnected(Boolean(event.online));
    };

    client.on("user.presence.changed", handlePresenceChanged);
    client.on("user.updated", handleUserUpdated);
    client.on("connection.changed", handleConnectionChanged);

    return () => {
      isMounted = false;
      client.off("user.presence.changed", handlePresenceChanged);
      client.off("user.updated", handleUserUpdated);
      client.off("connection.changed", handleConnectionChanged);
    };
  }, [authUser, streamToken, setClientConnected, setUserOnline]);

  // query presence status for an array of user ids
  const queryFriendsPresence = useCallback(
    async (userIds: string[]) => {
      if (!userIds || userIds.length === 0) return;
      const client = clientRef.current || StreamChat.getInstance(STREAM_API_KEY);
      if (!client.userID) return;

      try {
        const response = await client.queryUsers(
          { id: { $in: userIds } },
          { last_active: -1 },
          { presence: true },
        );
        if (response?.users) {
          setBatchUsersPresence(response.users);
        }
      } catch {
        // fail silently
      }
    },
    [setBatchUsersPresence],
  );

  return {
    isClientConnected,
    isUserOnline,
    getUserLastActive,
    queryFriendsPresence,
  };
};

export default useStreamPresence;
