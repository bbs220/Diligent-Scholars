import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  populateOutgoingFriendReqsFn,
  populateRecommendedUsersFn,
  populateUserFriendsFn,
  sendFriendReqFn,
} from "../libs/apiCalls";
import { Link } from "react-router";
import { MapPinIcon, UsersIcon } from "lucide-react";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import type { typeUser } from "../types/typesCollection";
import NoRecommendedUsers from "../components/NoRecommendedUsers";
import { capitalize } from "../libs/helper";

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
      outgoingFriendReqs.forEach((req: { id: string }) => {
        outgoingIds.add(req.id);
      });
      setOutgoingReqIDs(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        {/* total friends */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {/* if friends then load them */}
        {loadingUserFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friendsData.length === 0 ? (
          // if no friends then this
          <NoFriends />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* if friends then this */}
            {friendsData.map((friend: typeUser) => {
              <FriendCard key={friend._id} friend={friend} />;
            })}
          </div>
        )}
        {/* recommended friends part */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* hero */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Meet new developers
                </h2>
                <p className="opacity-70">
                  Discover new devs and trade skills with them
                </p>
              </div>
            </div>
          </div>
          {/* grid of recommended users */}
          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsersData.length === 0 ? (
            // if no recommended users found
            <NoRecommendedUsers />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* if friends then */}
              {recommendedUsersData.map((user: typeUser) => {
                const hasReqBeenSent = outgoingReqIDs.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-5 space-y-4">
                      <div className="flex items-center gap-4">
                        {/* friend avatar */}
                        <div className="avatar size-16 rounded-xl">
                          <img src={user.profileAvatar} alt={user.fullName} />
                        </div>
                        {/* friend name and location */}
                        <div>
                          <h3 className="font-semibold text-lg">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* friends skills */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="badge badge-secondary">
                          {`Proficient in:${capitalize(user.skillToShare)}`}
                        </span>
                        <span className="badge badge-secondary">
                          {`Learning for:${capitalize(user.skillToLearn)}`}
                        </span>
                      </div>
                      {/* friends bio */}
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      {/* submit button */}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
