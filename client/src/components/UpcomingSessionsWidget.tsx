import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlusIcon,
  VideoIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import {
  deleteSessionFn,
  getUserSessionsFn,
  populateUserFriendsFn,
  updateSessionStatusFn,
} from "../libs/apiCalls";
import { capitalize, handleApiError } from "../libs/helper";
import type { typeStudySession, typeUser } from "../types/typesCollection";
import ScheduleSessionModal from "./ScheduleSessionModal";

// format date and time into friendly label
const formatSessionTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today at ${timeStr}`;
  }

  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const isTomorrow =
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear();

  if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  }

  return `${date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
  })} at ${timeStr}`;
};

// upcoming study sessions widget component
const UpcomingSessionsWidget = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { authUser } = useAuthUser();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const { data: sessions = [], isLoading } = useQuery<typeStudySession[]>({
    queryKey: ["studySessions"],
    queryFn: getUserSessionsFn,
    enabled: Boolean(authUser),
  });

  const { data: friends = [] } = useQuery<typeUser[]>({
    queryKey: ["friends"],
    queryFn: populateUserFriendsFn,
    enabled: Boolean(authUser),
  });

  // update session status mutation
  const { mutate: updateStatusMutation } = useMutation({
    mutationFn: updateSessionStatusFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studySessions"] });
      toast.success(data?.message || "Session updated successfully");
    },
    onError: handleApiError,
  });

  // delete session mutation
  const { mutate: deleteSessionMutation } = useMutation({
    mutationFn: deleteSessionFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["studySessions"] });
      toast.success(data?.message || "Session removed successfully");
    },
    onError: handleApiError,
  });

  // filter upcoming active sessions
  const activeSessions = sessions.filter((s) => s.status === "scheduled");

  return (
    <div className="card bg-base-200 shadow-md">
      <div className="card-body p-4 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-5 text-primary" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Scheduled Study Sessions
            </h2>
            {activeSessions.length > 0 && (
              <span className="badge badge-primary badge-sm">
                {activeSessions.length}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn btn-primary btn-xs sm:btn-sm gap-1"
          >
            <PlusIcon className="size-3.5" />
            Schedule
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-6">
            <span className="loading loading-spinner loading-md" />
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="card bg-base-100 p-6 text-center space-y-2 border border-base-300">
            <CalendarIcon className="size-8 text-base-content opacity-30 mx-auto" />
            <p className="font-semibold text-sm">No Upcoming Study Sessions</p>
            <p className="text-xs opacity-60 max-w-sm mx-auto">
              Plan and lock in scheduled video study sessions with your scholar friends to stay disciplined.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(true)}
                className="btn btn-outline btn-xs sm:btn-sm gap-1"
              >
                <PlusIcon className="size-3.5" />
                Plan a Study Session
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeSessions.map((session) => {
              const isHost = session.host._id === authUser?._id;
              const partner = isHost ? session.participant : session.host;

              return (
                <div
                  key={session._id}
                  className="card bg-base-100 border border-base-300 p-4 space-y-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Link
                        to={`/user/${partner._id}`}
                        className="avatar size-10 rounded-lg shrink-0 hover:opacity-85"
                      >
                        <img
                          src={partner.profileAvatar}
                          alt={partner.fullName}
                          className="object-cover rounded-lg"
                        />
                      </Link>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {session.title}
                        </p>
                        <p className="text-xs opacity-70 truncate">
                          with {partner.fullName}
                        </p>
                      </div>
                    </div>
                    <span className="badge badge-primary badge-sm shrink-0">
                      📘 {capitalize(session.subject)}
                    </span>
                  </div>

                  {session.notes && (
                    <p className="text-xs opacity-60 line-clamp-2 bg-base-200/50 p-2 rounded-md">
                      {session.notes}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-base-200">
                    <div className="flex items-center gap-2 opacity-80">
                      <span className="font-medium text-primary">
                        {formatSessionTime(session.scheduledDate)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <ClockIcon className="size-3" />
                        {session.durationMinutes}m
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          updateStatusMutation({
                            sessionId: session._id,
                            status: "completed",
                          })
                        }
                        title="Mark Completed"
                        className="btn btn-ghost btn-xs btn-square text-success"
                      >
                        <CheckCircle2Icon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteSessionMutation(session._id)}
                        title="Cancel Session"
                        className="btn btn-ghost btn-xs btn-square text-error"
                      >
                        <XCircleIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/call/${session.callId}`)}
                        className="btn btn-success btn-xs gap-1 ml-1"
                      >
                        <VideoIcon className="size-3" />
                        Join Call
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ScheduleSessionModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        friends={friends}
      />
    </div>
  );
};

export default UpcomingSessionsWidget;
