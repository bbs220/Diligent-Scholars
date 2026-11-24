import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import {
  BellIcon,
  BookOpenText,
  HomeIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { populateFriendReqsFn } from "../libs/apiCalls";
import { usePresenceStore } from "../stores/usePresenceStore";

const SideBar = () => {
  const { authUser } = useAuthUser();
  const isClientConnected = usePresenceStore(
    (state) => state.isClientConnected,
  );

  const location = useLocation();
  const currentPath = location.pathname;

  const { data: friendReqsData } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: populateFriendReqsFn,
    enabled: Boolean(authUser),
  });
  const pendingCount = friendReqsData?.incomingReqs?.length || 0;

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-full shrink-0 sticky top-0">
      <div className="p-5 border-b border-base-300 h-16 flex items-center shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <BookOpenText className="size-8 text-primary" />
          <span className="text-xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
            Diligent Scholars
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        {/* <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link> */}

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span className="flex-1 text-left">Notifications</span>
          {pendingCount > 0 && (
            <span className="badge badge-primary badge-sm">
              {pendingCount}
            </span>
          )}
        </Link>

        <Link
          to="/profile"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/profile" ? "btn-active" : ""
          }`}
        >
          <UserIcon className="size-5 text-base-content opacity-70" />
          <span>Profile</span>
        </Link>
      </nav>

      {/* user profile */}
      <Link
        to="/profile"
        className="p-4 border-t border-base-300 mt-auto shrink-0 hover:bg-base-300/50 transition-colors block"
      >
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-lg">
              <img src={authUser?.profileAvatar} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">
              {authUser?.fullName}
            </p>
            {isClientConnected ? (
              <p className="text-xs text-success flex items-center gap-1">
                <span className="size-2 rounded-full bg-success inline-block shrink-0" />
                Online
              </p>
            ) : (
              <p className="text-xs opacity-60 flex items-center gap-1">
                <span className="size-2 rounded-full bg-base-content/40 inline-block shrink-0" />
                Connecting...
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* legal links */}
      <div className="px-4 py-2 text-xs opacity-60 flex items-center justify-between border-t border-base-300 shrink-0">
        <div className="flex gap-2">
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <span>•</span>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
        <span>© 2026</span>
      </div>
    </aside>
  );
};
export default SideBar;
