import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendReqFn, populateFriendReqsFn } from "../libs/apiCalls";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendReqsData, isLoading } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: populateFriendReqsFn,
  });

  const { mutate: acceptReqMutation, isPending } = useMutation({
    mutationFn: acceptFriendReqFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingReqs = friendReqsData?.incomingReqs || [];
  const accceptedReqs = friendReqsData?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? <div></div> : <div></div>}
      </div>
    </div>
  );
};

export default NotificationsPage;
