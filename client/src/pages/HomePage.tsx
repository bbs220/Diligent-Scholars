import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import NoRecommendedUsers from "../components/NoRecommendedUsers";
import {
  populateOutgoingFriendReqsFn,
  populateRecommendedUsersFn,
  populateUserFriendsFn,
  sendFriendReqFn,
} from "../libs/apiCalls";
import { capitalize } from "../libs/helper";
import type { typeUser } from "../types/typesCollection";

const HomePage = () => {
  const queryClient = useQueryClient();

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

  const outgoingReqIDs = useMemo(() => {
    const ids = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req: { receiver: { _id: string } }) => {
        ids.add(req.receiver._id);
      });
    }
    return ids;
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
            {friendsData.map((friend: typeUser) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
        {/* recommended friends part */}
        <section>
          <div className="mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* hero */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Meet new scholars
                </h2>
                <p className="opacity-70">
                  Discover new scholars and learn from them
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
                        <span className="badge badge-primary">
                          {`📘 ${capitalize(user.skillToShare)}`}
                        </span>
                        <span className="badge badge-secondary">
                          {`📖 ${capitalize(user.skillToLearn)}`}
                        </span>
                      </div>
                      {/* friends bio */}
                      {user.bio && (
                        <p className="text-sm opacity-70">{user.bio}</p>
                      )}
                      {/* submit button */}
                      <button
                        className={`btn w-full mt-2 ${hasReqBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendReqMutation(user._id)}
                        disabled={hasReqBeenSent || isPending}
                      >
                        {hasReqBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 mr-2" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 mr-2" />
                            Send Friend Request
                          </>
                        )}
                      </button>
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
