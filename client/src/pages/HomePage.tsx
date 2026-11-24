import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircleIcon,
  MapPinIcon,
  SearchIcon,
  SparklesIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import FriendCard from "../components/FriendCard";
import NoFriends from "../components/NoFriends";
import NoRecommendedUsers from "../components/NoRecommendedUsers";
import { COUNTRIES, SKILLS } from "../constants/constantsCollection";
import useAuthUser from "../hooks/useAuthUser";
import {
  cancelFriendReqFn,
  populateOutgoingFriendReqsFn,
  populateRecommendedUsersFn,
  populateUserFriendsFn,
  sendFriendReqFn,
} from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeUser } from "../types/typesCollection";

const HomePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [scholarSearch, setScholarSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");

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

  const { mutate: cancelReqMutation, isPending: isCancelling } = useMutation({
    mutationFn: cancelFriendReqFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success(data?.message || "Friend request cancelled!");
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

  const filteredScholars = useMemo(() => {
    return recommendedUsersData.filter((user: typeUser) => {
      const matchesName = user.fullName
        .toLowerCase()
        .includes(scholarSearch.toLowerCase().trim());
      const matchesSubject = subjectFilter
        ? user.skillToShare.toLowerCase() === subjectFilter.toLowerCase() ||
          user.skillToLearn.toLowerCase() === subjectFilter.toLowerCase()
        : true;
      const matchesCountry = countryFilter
        ? user.location?.toLowerCase() === countryFilter.toLowerCase()
        : true;
      return matchesName && matchesSubject && matchesCountry;
    });
  }, [recommendedUsersData, scholarSearch, subjectFilter, countryFilter]);

  const getMatchBadge = (user: typeUser) => {
    if (!authUser?.skillToShare || !authUser?.skillToLearn) return null;
    const teachesWhatYouWant =
      user.skillToShare.toLowerCase() === authUser.skillToLearn.toLowerCase();
    const wantsWhatYouTeach =
      user.skillToLearn.toLowerCase() === authUser.skillToShare.toLowerCase();

    if (teachesWhatYouWant && wantsWhatYouTeach) {
      return (
        <span className="badge badge-accent badge-sm font-semibold gap-1">
          <SparklesIcon className="size-3" />
          Perfect Match
        </span>
      );
    }
    if (teachesWhatYouWant) {
      return (
        <span className="badge badge-primary badge-sm">
          🎯 Teaches Your Goal
        </span>
      );
    }
    if (wantsWhatYouTeach) {
      return (
        <span className="badge badge-info badge-sm">
          💡 Wants Your Skill
        </span>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
      <h1 className="sr-only">Diligent Scholars Dashboard</h1>
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
          <div className="mb-6 sm:mb-8 space-y-4">
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

            {/* scholar search and filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
              <div className="relative sm:col-span-6">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <SearchIcon className="size-4 text-base-content opacity-50" />
                </div>
                <input
                  type="text"
                  placeholder="Search scholars by name..."
                  value={scholarSearch}
                  onChange={(e) => setScholarSearch(e.target.value)}
                  className="input input-bordered w-full pl-9 input-sm sm:input-md"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="select select-bordered w-full select-sm sm:select-md"
                >
                  <option value="">All Subjects</option>
                  {SKILLS.map((skill) => (
                    <option key={skill} value={skill.toLowerCase()}>
                      {skill}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value)}
                  className="select select-bordered w-full select-sm sm:select-md"
                >
                  <option value="">All Countries</option>
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country.toLowerCase()}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(scholarSearch || subjectFilter || countryFilter) && (
              <div className="flex items-center gap-2 text-xs opacity-70">
                <span>Active filters:</span>
                {scholarSearch && <span className="badge badge-sm badge-ghost">name: {scholarSearch}</span>}
                {subjectFilter && <span className="badge badge-sm badge-ghost">subject: {subjectFilter}</span>}
                {countryFilter && <span className="badge badge-sm badge-ghost">country: {countryFilter}</span>}
                <button
                  type="button"
                  onClick={() => {
                    setScholarSearch("");
                    setSubjectFilter("");
                    setCountryFilter("");
                  }}
                  className="btn btn-ghost btn-xs text-error ml-auto"
                >
                  <XIcon className="size-3 mr-1" />
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* grid of recommended users */}
          {loadingRecommendedUsers ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsersData.length === 0 ? (
            // if no recommended users found
            <NoRecommendedUsers />
          ) : filteredScholars.length === 0 ? (
            <div className="card bg-base-200 p-8 text-center space-y-2">
              <p className="font-semibold text-lg">No scholars match your filters</p>
              <p className="text-sm opacity-70">
                Try searching for another subject or clearing your filters
              </p>
              <div>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost mt-2"
                  onClick={() => {
                    setScholarSearch("");
                    setSubjectFilter("");
                    setCountryFilter("");
                  }}
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {/* if recommended users then */}
              {filteredScholars.map((user: typeUser) => {
                const hasReqBeenSent = outgoingReqIDs.has(user._id);
                const matchBadge = getMatchBadge(user);
                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
                  >
                    <div className="card-body p-5 flex flex-col h-full space-y-4">
                      {matchBadge && <div>{matchBadge}</div>}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* friend avatar */}
                        <Link
                          to={`/user/${user._id}`}
                          className="avatar size-14 sm:size-16 rounded-xl shrink-0 hover:opacity-85 transition-opacity"
                        >
                          <img
                            src={user.profileAvatar}
                            alt={user.fullName}
                            className="object-cover rounded-xl"
                          />
                        </Link>
                        {/* friend name and location */}
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/user/${user._id}`}
                            className="font-semibold text-base sm:text-lg truncate block hover:underline"
                          >
                            {user.fullName}
                          </Link>
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
                      {hasReqBeenSent ? (
                        <div className="flex gap-2 w-full mt-auto">
                          <button
                            type="button"
                            className="btn btn-outline btn-success flex-1 btn-sm sm:btn-md btn-disabled opacity-80"
                            disabled
                          >
                            <CheckCircleIcon className="size-4 mr-1 shrink-0" />
                            Sent
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline btn-error btn-sm sm:btn-md shrink-0"
                            onClick={() => cancelReqMutation(user._id)}
                            disabled={isCancelling}
                            title="Cancel friend request"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-primary w-full mt-auto btn-sm sm:btn-md"
                          onClick={() => sendReqMutation(user._id)}
                          disabled={isPending}
                        >
                          <UserPlusIcon className="size-4 sm:size-5 mr-1 sm:mr-2 shrink-0" />
                          Send Friend Request
                        </button>
                      )}
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
