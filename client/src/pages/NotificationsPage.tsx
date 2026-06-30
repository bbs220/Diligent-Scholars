import { useQuery, useQueryClient } from "@tanstack/react-query";
import { populateFriendReqsFn } from "../libs/apiCalls";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendReqsData, isLoading } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: populateFriendReqsFn,
  });
  return <div>NotificationsPage</div>;
};

export default NotificationsPage;
