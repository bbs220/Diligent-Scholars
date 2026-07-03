import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendReqFn, populateFriendReqsFn } from "../libs/apiCalls";
import { BellIcon, ClockIcon, UserCheckIcon } from "lucide-react";
import type { typeUser } from "../types/typesCollection";
import NoNotificationFound from "../components/NoNotificationFound";
import { capitalize } from "../libs/helper";

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
    <div className="p-4 sm:p-6 lg:p-8 w-full">
      <div className="container mx-auto max-w-4xl space-y-8 sm:space-y-10">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4 sm:mb-6">
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
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="size-5 sm:size-6 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-1 sm:ml-2">
                    {incomingReqs.length}
                  </span>
                </h2>
                <div className="space-y-3 sm:space-y-4">
                  {incomingReqs.map(
                    (req: { _id: string; sender: typeUser }) => (
                      <div
                        key={req._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4 sm:p-5">
                          <div className="flex items-center justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                              <div className="avatar size-12 sm:size-14 rounded-xl bg-base-300 shrink-0">
                                <img
                                  src={req.sender.profileAvatar}
                                  alt={req.sender.fullName}
                                  className="object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-base sm:text-lg truncate">
                                  {req.sender.fullName}
                                </h3>
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  <span className="badge badge-success badge-sm sm:badge-md">
                                    📘{capitalize(req.sender.skillToShare)}
                                  </span>
                                  <span className="badge badge-warning badge-sm sm:badge-md">
                                    📖{capitalize(req.sender.skillToLearn)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary btn-sm sm:btn-md shrink-0"
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
              <section className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2 mb-3 sm:mb-4">
                  <BellIcon className="size-5 sm:size-6 text-success" />
                  New Friends
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {acceptedReqs.map(
                    (notif: { _id: string; receiver: typeUser }) => (
                      <div
                        key={notif._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4 sm:p-5">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="avatar shrink-0">
                              <img
                                src={notif.receiver.profileAvatar}
                                alt={notif.receiver.fullName}
                                className="mt-1 size-10 sm:size-12 rounded-md object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base sm:text-lg truncate">
                                {notif.receiver.fullName}
                              </h3>
                              <p className="text-sm sm:text-base my-1 opacity-90">
                                {notif.receiver.fullName} accepted your friend
                                request!
                              </p>
                              <p className="text-xs sm:text-sm flex items-center opacity-70 mt-1 sm:mt-2">
                                <ClockIcon className="size-3 sm:size-3.5 mr-1 shrink-0" />
                                Recently
                              </p>
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
