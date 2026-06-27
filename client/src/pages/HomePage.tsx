import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  populateOutgoingFriendReqsFn,
  populateRecommendedUsersFn,
  populateUserFriendsFn,
  sendFriendReqFn,
} from "../libs/apiCalls";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [outgoingReqIDs, setOutgoingReqIDs] = useState([]);

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

  return <div>HomePage</div>;
};

export default HomePage;
