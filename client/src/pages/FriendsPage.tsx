import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPinIcon,
  MessageSquareIcon,
  SearchIcon,
  Trash2Icon,
  UserXIcon,
  UsersIcon,
  VideoIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";
import NoFriends from "../components/NoFriends";
import { SKILLS } from "../constants/constantsCollection";
import useAuthUser from "../hooks/useAuthUser";
import { populateUserFriendsFn, removeFriendFn } from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeUser } from "../types/typesCollection";

const FriendsPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [friendToRemove, setFriendToRemove] = useState<typeUser | null>(null);

  const { data: friends = [], isLoading } = useQuery<typeUser[]>({
    queryKey: ["friends"],
    queryFn: populateUserFriendsFn,
  });

  const { mutate: removeFriendMutation, isPending: isRemoving } = useMutation({
    mutationFn: removeFriendFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      toast.success(data?.message || "Friend removed successfully");
      setFriendToRemove(null);
    },
    onError: handleApiError,
  });

  const filteredFriends = useMemo(() => {
    return friends.filter((friend) => {
      const matchesName = friend.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      const matchesSubject = subjectFilter
        ? friend.skillToShare.toLowerCase() === subjectFilter.toLowerCase() ||
          friend.skillToLearn.toLowerCase() === subjectFilter.toLowerCase()
        : true;
      return matchesName && matchesSubject;
    });
  }, [friends, searchQuery, subjectFilter]);

  const handleStartCall = (friendId: string) => {
    if (!authUser) return;
    const callId = [authUser._id, friendId].sort().join("-");
    navigate(`/call/${callId}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto font-inter">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
              <UsersIcon className="size-7 text-primary" />
              My Friends
              <span className="badge badge-primary badge-md ml-2">
                {friends.length}
              </span>
            </h1>
            <p className="text-sm opacity-70 mt-1">
              Connect, collaborate and initiate study sessions with your scholar friends
            </p>
          </div>

          <Link to="/notifications" className="btn btn-outline btn-sm sm:btn-md">
            Pending Requests
          </Link>
        </div>

        {/* search and filter controls */}
        {friends.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <SearchIcon className="size-4 text-base-content opacity-50" />
              </div>
              <input
                type="text"
                placeholder="Search friends by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered w-full pl-9 input-sm sm:input-md"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="select select-bordered select-sm sm:select-md sm:w-48"
            >
              <option value="">All Subjects</option>
              {SKILLS.map((skill) => (
                <option key={skill} value={skill.toLowerCase()}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriends />
        ) : filteredFriends.length === 0 ? (
          <div className="card bg-base-200 p-8 text-center space-y-3">
            <UserXIcon className="size-10 text-base-content opacity-40 mx-auto" />
            <p className="font-semibold text-lg">No friends match your filter</p>
            <p className="text-sm opacity-70">
              Try adjusting your search query or subject filter
            </p>
            <div>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => {
                  setSearchQuery("");
                  setSubjectFilter("");
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredFriends.map((friend) => (
              <div
                key={friend._id}
                className="card bg-base-200 hover:shadow-lg transition-all duration-300 h-full flex flex-col"
              >
                <div className="card-body p-5 flex flex-col h-full space-y-3">
                  <div className="flex items-center gap-3">
                    <Link
                      to={`/user/${friend._id}`}
                      className="avatar size-14 rounded-xl shrink-0 hover:opacity-85 transition-opacity"
                    >
                      <img
                        src={friend.profileAvatar}
                        alt={friend.fullName}
                        className="object-cover rounded-xl"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/user/${friend._id}`}
                        className="font-semibold text-base truncate block hover:underline"
                      >
                        {friend.fullName}
                      </Link>
                      {friend.location && (
                        <div className="flex items-center text-xs opacity-70 mt-0.5">
                          <MapPinIcon className="size-3 mr-1 shrink-0" />
                          <span className="truncate">{friend.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* skills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="badge badge-success badge-sm">
                      📘 {capitalize(friend.skillToShare)}
                    </span>
                    <span className="badge badge-warning badge-sm">
                      📖 {capitalize(friend.skillToLearn)}
                    </span>
                  </div>

                  {/* action buttons */}
                  <div className="pt-2 mt-auto space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        to={`/chat/${friend._id}`}
                        className="btn btn-primary btn-sm gap-1 w-full"
                      >
                        <MessageSquareIcon className="size-3.5" />
                        Chat
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleStartCall(friend._id)}
                        className="btn btn-outline btn-success btn-sm gap-1 w-full"
                      >
                        <VideoIcon className="size-3.5" />
                        Call
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setFriendToRemove(friend)}
                      className="btn btn-ghost btn-xs w-full text-error opacity-70 hover:opacity-100"
                    >
                      <Trash2Icon className="size-3 mr-1" />
                      Remove Friend
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* remove confirmation modal */}
      {friendToRemove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="card bg-base-100 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-error flex items-center gap-2">
              <UserXIcon className="size-5" />
              Remove Friend
            </h3>
            <p className="text-sm opacity-80">
              Are you sure you want to remove{" "}
              <span className="font-semibold">{friendToRemove.fullName}</span> from
              your friends list? You will need to send another friend request to
              reconnect.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setFriendToRemove(null)}
                disabled={isRemoving}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => removeFriendMutation(friendToRemove._id)}
                disabled={isRemoving}
              >
                {isRemoving ? "Removing..." : "Confirm Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsPage;
