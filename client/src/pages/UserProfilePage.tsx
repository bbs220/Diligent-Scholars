import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  MapPinIcon,
  MessageSquareIcon,
  ShieldAlertIcon,
  ShieldBanIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import {
  blockUserFn,
  cancelFriendReqFn,
  getUserProfileFn,
  removeFriendFn,
  reportUserFn,
  sendFriendReqFn,
  unblockUserFn,
} from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeScholarProfile } from "../types/typesCollection";

const UserProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("Harassment or bullying");
  const [reportDetails, setReportDetails] = useState("");

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

  const { mutate: cancelReqMutation, isPending: isCancelling } = useMutation({
    mutationFn: cancelFriendReqFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scholarProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      toast.success(data?.message || "Friend request cancelled");
    },
    onError: handleApiError,
  });

  const { mutate: removeFriendMutation, isPending: isRemoving } = useMutation({
    mutationFn: removeFriendFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scholarProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      toast.success(data?.message || "Friend removed successfully");
    },
    onError: handleApiError,
  });

  const { mutate: blockMutation, isPending: isBlocking } = useMutation({
    mutationFn: blockUserFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scholarProfile", id] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      toast.success(data?.message || "User blocked successfully");
      setIsBlockModalOpen(false);
    },
    onError: handleApiError,
  });

  const { mutate: unblockMutation, isPending: isUnblocking } = useMutation({
    mutationFn: unblockUserFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["scholarProfile", id] });
      toast.success(data?.message || "User unblocked successfully");
    },
    onError: handleApiError,
  });

  const { mutate: reportMutation, isPending: isReporting } = useMutation({
    mutationFn: reportUserFn,
    onSuccess: (data) => {
      toast.success(data?.message || "Report submitted successfully");
      setIsReportModalOpen(false);
      setReportDetails("");
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
  const isBlocked = Boolean(scholar.relationship?.isBlocked);
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
              ) : isBlocked ? (
                <div className="flex items-center gap-2">
                  <span className="badge badge-error gap-1">
                    <ShieldBanIcon className="size-3.5" />
                    Blocked
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm sm:btn-md"
                    onClick={() => unblockMutation(scholar._id)}
                    disabled={isUnblocking}
                  >
                    Unblock
                  </button>
                </div>
              ) : isFriend ? (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <Link
                    to={`/chat/${scholar._id}`}
                    className="btn btn-primary btn-sm sm:btn-md gap-2"
                  >
                    <MessageSquareIcon className="size-4" />
                    Send Message
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline btn-error btn-sm sm:btn-md"
                    onClick={() => removeFriendMutation(scholar._id)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? "Removing..." : "Remove Friend"}
                  </button>
                </div>
              ) : requestStatus === "sent" ? (
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    className="btn btn-disabled btn-sm sm:btn-md gap-2"
                    disabled
                  >
                    <CheckCircleIcon className="size-4" />
                    Request Sent
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-error btn-sm sm:btn-md"
                    onClick={() => cancelReqMutation(scholar._id)}
                    disabled={isCancelling}
                  >
                    Cancel Request
                  </button>
                </div>
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

              {!isSelf && !isBlocked && (
                <div className="dropdown dropdown-end">
                  <button
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-square btn-sm sm:btn-md"
                    title="Safety Options"
                    aria-label="Safety options"
                  >
                    <ShieldAlertIcon className="size-5 opacity-70" />
                  </button>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu bg-base-200 rounded-box z-20 w-44 p-2 shadow-lg border border-base-300"
                  >
                    <li>
                      <button
                        type="button"
                        className="text-warning flex items-center gap-2 text-xs"
                        onClick={() => setIsReportModalOpen(true)}
                      >
                        <FlagIcon className="size-4" />
                        Report Scholar
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="text-error flex items-center gap-2 text-xs"
                        onClick={() => setIsBlockModalOpen(true)}
                      >
                        <ShieldBanIcon className="size-4" />
                        Block Scholar
                      </button>
                    </li>
                  </ul>
                </div>
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

      {/* report modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="card bg-base-100 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-warning flex items-center gap-2">
              <FlagIcon className="size-5" />
              Report Scholar
            </h3>
            <p className="text-sm opacity-80">
              Help us keep Diligent Scholars safe. Reports are confidential and reviewed by our moderation team.
            </p>
            <div className="form-control space-y-1">
              <label className="label py-1" htmlFor="report-reason">
                <span className="label-text font-medium text-xs">Reason</span>
              </label>
              <select
                id="report-reason"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="select select-bordered w-full select-sm sm:select-md"
              >
                <option value="Harassment or bullying">Harassment or bullying</option>
                <option value="Spam or advertising">Spam or advertising</option>
                <option value="Inappropriate content">Inappropriate content</option>
                <option value="Impersonation">Impersonation</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-control space-y-1">
              <label className="label py-1" htmlFor="report-details">
                <span className="label-text font-medium text-xs">
                  Additional Details (Optional)
                </span>
              </label>
              <textarea
                id="report-details"
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Describe what occurred..."
                className="textarea textarea-bordered w-full h-20 text-sm"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsReportModalOpen(false)}
                disabled={isReporting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-warning btn-sm"
                onClick={() =>
                  reportMutation({
                    userId: scholar._id,
                    reportData: { reason: reportReason, details: reportDetails },
                  })
                }
                disabled={isReporting}
              >
                {isReporting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* block modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="card bg-base-100 shadow-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-error flex items-center gap-2">
              <ShieldBanIcon className="size-5" />
              Block Scholar
            </h3>
            <p className="text-sm opacity-80">
              Are you sure you want to block <span className="font-semibold">{scholar.fullName}</span>? You will no longer receive messages or see each other across the platform.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setIsBlockModalOpen(false)}
                disabled={isBlocking}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => blockMutation(scholar._id)}
                disabled={isBlocking}
              >
                {isBlocking ? "Blocking..." : "Confirm Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePage;
