import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  populateOutgoingFriendReqsFn,
  populateRecommendedUsersFn,
  populateUserFriendsFn,
  sendFriendReqFn,
} from "../libs/apiCalls";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [outgoingReqIDs, setOutgoingReqIDs] = useState(new Set());

  const { data: friendsData = [], isLoading: loadingUserFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: populateUserFriendsFn,
  });

  const {
    data: recommendedUsersData = [],
    isLoading: loadingRecommendedUsers,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: populateRecommendedUsersFn,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: populateOutgoingFriendReqsFn,
  });

  const { mutate: sendReqMutation, isPending } = useMutation({
    mutationFn: sendFriendReqFn,

    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] }),
  });

  useEffect(() => {
    const outgoingIds = new Set();

    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.id);
      });
      setOutgoingReqIDs(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
