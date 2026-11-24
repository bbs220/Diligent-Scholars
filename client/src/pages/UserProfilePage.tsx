import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  MapPinIcon,
  MessageSquareIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { getUserProfileFn, sendFriendReqFn } from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeScholarProfile } from "../types/typesCollection";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: scholar, isLoading } = useQuery<typeScholarProfile>({
    queryKey: ["scholarProfile", id],
    queryFn: () => getUserProfileFn(id!),
    enabled: Boolean(id),
  });

  const { mutate: sendReqMutation, isPending: isSendingReq } = useMutation({
    mutationFn: sendFriendReqFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scholarProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success(data?.message || "Friend request sent!");
    },
    onError: handleApiError,
  });

  if (isLoading) return <PageLoader />;

  if (!scholar) {
    return (
      <div className="p-8 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold">Scholar not found</h2>
        <p className="text-sm opacity-70 mt-2">
          The requested scholar profile does not exist.
        </p>
        <Link to="/" className="btn btn-primary btn-sm mt-4">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { isSelf, isFriend, requestStatus } = scholar.relationship || {};
  const formattedDate = scholar.createdAt
    ? new Date(scholar.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-4xl mx-auto font-inter">
      <div className="card bg-base-200 shadow-xl overflow-hidden">
        {/* header banner */}
        <div className="h-32 sm:h-40 bg-linear-to-r from-primary/30 to-secondary/30 relative" />

        <div className="card-body p-6 sm:p-8 pt-0 relative">
          {/* avatar & action row */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="avatar size-28 sm:size-36 rounded-2xl ring-4 ring-base-200 bg-base-300 overflow-hidden shadow-lg shrink-0">
              <img
                src={scholar.profileAvatar}
                alt={scholar.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {isSelf ? (
                <Link to="/profile" className="btn btn-outline btn-sm sm:btn-md w-full sm:w-auto">
                  Edit My Profile
                </Link>
              ) : isFriend ? (
                <Link
                  to={`/chat/${scholar._id}`}
                  className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto gap-2"
                >
                  <MessageSquareIcon className="size-4" />
                  Send Message
                </Link>
              ) : requestStatus === "sent" ? (
                <button
                  type="button"
                  className="btn btn-disabled btn-sm sm:btn-md w-full sm:w-auto gap-2"
                  disabled
                >
                  <CheckCircleIcon className="size-4" />
                  Request Sent
                </button>
              ) : requestStatus === "received" ? (
                <Link
                  to="/notifications"
                  className="btn btn-warning btn-sm sm:btn-md w-full sm:w-auto gap-2"
                >
                  <ClockIcon className="size-4" />
                  Pending in Notifications
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm sm:btn-md w-full sm:w-auto gap-2"
                  onClick={() => sendReqMutation(scholar._id)}
                  disabled={isSendingReq}
                >
                  <UserPlusIcon className="size-4" />
                  {isSendingReq ? "Sending..." : "Add Friend"}
                </button>
              )}
            </div>
          </div>

          {/* scholar details */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {scholar.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm opacity-70 mt-1">
                {scholar.location && (
                  <span className="flex items-center gap-1">
                    <MapPinIcon className="size-3.5" />
                    {scholar.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <UsersIcon className="size-3.5" />
                  {scholar.friendsCount} {scholar.friendsCount === 1 ? "friend" : "friends"}
                </span>
                {formattedDate && (
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5" />
                    Joined {formattedDate}
                  </span>
                )}
              </div>
            </div>

            {/* skills badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="badge badge-success badge-md p-3">
                📘 Teaching: {capitalize(scholar.skillToShare)}
              </span>
              <span className="badge badge-warning badge-md p-3">
                📖 Learning: {capitalize(scholar.skillToLearn)}
              </span>
            </div>

            {/* bio */}
            {scholar.bio && (
              <div className="pt-2">
                <h2 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-1">
                  About
                </h2>
                <p className="text-sm sm:text-base leading-relaxed opacity-90 whitespace-pre-line">
                  {scholar.bio}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
