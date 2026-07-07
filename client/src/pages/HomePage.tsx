import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  MapPinIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo } from "react";
import toast from "react-hot-toast";
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
import { capitalize, handleApiError } from "../libs/helper";
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

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });

      toast.success(data?.message || "Friend request sent!");
    },

    onError: handleApiError,
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
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <div className="space-y-10 sm:space-y-12">
        {/* total friends */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Your Friends
          </h2>
          <Link
            to="/notifications"
            className="btn btn-outline btn-sm sm:btn-md"
          >
            <UsersIcon className="mr-1 sm:mr-2 size-4" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {/* if friends then this */}
            {friendsData.map((friend: typeUser) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* recommended friends part */}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* hero */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Meet new scholars
                </h2>
                <p className="text-sm sm:text-base opacity-70 mt-1">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* if recommended users then */}
              {recommendedUsersData.map((user: typeUser) => {
                const hasReqBeenSent = outgoingReqIDs.has(user._id);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="card-body p-5 flex flex-col h-full space-y-4">
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* friend avatar */}
                        <div className="avatar size-14 sm:size-16 rounded-xl shrink-0">
                          <img
                            src={user.profileAvatar}
                            alt={user.fullName}
                            className="object-cover"
                          />
                        </div>
                        {/* friend name and location */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base sm:text-lg truncate">
                            {user.fullName}
                          </h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1 shrink-0" />
                              <span className="truncate">{user.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* friends skills */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        <span className="badge badge-success badge-sm sm:badge-md">
                          {`📘 ${capitalize(user.skillToShare)}`}
                        </span>
                        <span className="badge badge-warning badge-sm sm:badge-md">
                          {`📖 ${capitalize(user.skillToLearn)}`}
                        </span>
                      </div>

                      {/* friends bio */}
                      {user.bio && (
                        <p className="text-sm opacity-70 line-clamp-2 sm:line-clamp-3">
                          {user.bio}
                        </p>
                      )}

                      {/* submit button */}
                      <button
                        className={`btn w-full mt-auto btn-sm sm:btn-md ${hasReqBeenSent ? "btn-disabled" : "btn-primary"}`}
                        onClick={() => sendReqMutation(user._id)}
                        disabled={hasReqBeenSent || isPending}
                      >
                        {hasReqBeenSent ? (
                          <>
                            <CheckCircleIcon className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
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
