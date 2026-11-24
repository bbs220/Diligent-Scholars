import { Link, useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquareIcon, Trash2Icon, VideoIcon } from "lucide-react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { removeFriendFn } from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeUser } from "../types/typesCollection";

type typeFriendCard = {
  friend: typeUser;
};

const FriendCard = ({ friend }: typeFriendCard) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const { mutate: removeFriendMutation, isPending: isRemoving } = useMutation({
    mutationFn: removeFriendFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      toast.success(data?.message || "Friend removed successfully");
    },
    onError: handleApiError,
  });

  const handleStartCall = () => {
    if (!authUser) return;
    const callId = [authUser._id, friend._id].sort().join("-");
    navigate(`/call/${callId}`);
  };

  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="card-body p-4 sm:p-5 flex flex-col h-full">
        {/* user info */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 min-w-0">
          <Link
            to={`/user/${friend._id}`}
            className="avatar shrink-0 hover:opacity-85 transition-opacity"
          >
            <div className="size-12 sm:size-14 rounded-xl">
              <img
                src={friend.profileAvatar}
                alt={friend.fullName}
                className="object-cover rounded-xl"
              />
            </div>
          </Link>
          <Link
            to={`/user/${friend._id}`}
            className="font-semibold text-base sm:text-lg truncate flex-1 min-w-0 hover:underline"
          >
            {friend.fullName}
          </Link>
        </div>
        {/* badges */}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
          <span className="badge badge-success badge-sm sm:badge-md">
            📘 {capitalize(friend.skillToShare)}
          </span>
          <span className="badge badge-warning badge-sm sm:badge-md">
            📖 {capitalize(friend.skillToLearn)}
          </span>
        </div>
        {/* link to chat */}
        <div className="mt-auto space-y-2">
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
              onClick={handleStartCall}
              className="btn btn-outline btn-success btn-sm gap-1 w-full"
            >
              <VideoIcon className="size-3.5" />
              Call
            </button>
          </div>
          <button
            type="button"
            onClick={() => removeFriendMutation(friend._id)}
            disabled={isRemoving}
            className="btn btn-ghost btn-xs w-full text-error opacity-70 hover:opacity-100"
          >
            <Trash2Icon className="size-3 mr-1" />
            {isRemoving ? "Removing..." : "Remove Friend"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default FriendCard;
