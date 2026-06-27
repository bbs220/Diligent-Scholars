import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  populateRecommendedUsers,
  populateUserFriends,
} from "../libs/apiCalls";

const HomePage = () => {
  const queryClient = useQueryClient();

  const [outgoingReqIDs, setOutgoingReqIDs] = useState([]);

  const { data: friendsData = [], isLoading: loadingUserFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: populateUserFriends,
  });

  const {
    data: recommendedUsersData = [],
    isLoading: loadingRecommendedUsers,
  } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: populateRecommendedUsers,
  });
  return <div>HomePage</div>;
};

export default HomePage;
