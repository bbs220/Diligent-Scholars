import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendReqFn, populateFriendReqsFn } from "../libs/apiCalls";
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
} from "lucide-react";
import type { typeUser } from "../types/typesCollection";
import NoNotificationFound from "../components/NoNotificationFound";

const NotificationsPage = () => {
  const queryClient = useQueryClient();

  const { data: friendReqsData, isLoading } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: populateFriendReqsFn,
  });

  const { mutate: acceptReqMutation, isPending } = useMutation({
    mutationFn: acceptFriendReqFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const incomingReqs = friendReqsData?.incomingReqs || [];
  const acceptedReqs = friendReqsData?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-6">
          Notifications
        </h1>
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <>
            {/* pending friend reqs */}
            {incomingReqs.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">
                    {incomingReqs.length}
                  </span>
                </h2>
                <div className="space-y-3">
                  {incomingReqs.map(
                    (req: { _id: string; sender: typeUser }) => (
                      <div
                        key={req._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="avatar size-14 rounded-xl bg-base-300">
                                <img
                                  src={req.sender.profileAvatar}
                                  alt={req.sender.fullName}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {req.sender.fullName}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-primary badge-sm">
                                    📘{req.sender.skillToShare}
                                  </span>
                                  <span className="badge badge-secondary badge-sm">
                                    📖{req.sender.skillToLearn}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => acceptReqMutation(req._id)}
                              disabled={isPending}
                            >
                              Accept
                            </button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {/* accepted friend reqs */}
            {acceptedReqs.length > 0 && (
              <section className="spacey-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <BellIcon className="size-5 text-success" />
                  New Friends
                </h2>

                <div className="space-y-3">
                  {acceptedReqs.map(
                    (notif: { _id: string; receiver: typeUser }) => (
                      <div
                        key={notif._id}
                        className="card bg-base-200 shadow-sm"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar">
                              <img
                                src={notif.receiver.profileAvatar}
                                alt={notif.receiver.fullName}
                                className="mt-1 size-10 rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">
                                {notif.receiver.fullName}
                              </h3>
                              <p className="text-sm my-1">
                                {notif.receiver.fullName} accepted your friend
                                request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>
            )}

            {incomingReqs.length === 0 && acceptedReqs.length === 0 && (
              <NoNotificationFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
