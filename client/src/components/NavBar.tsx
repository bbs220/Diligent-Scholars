import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, BookOpenText, LogOutIcon, Menu, X } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogOut from "../hooks/useLogOut";
import { useQuery } from "@tanstack/react-query";
import { populateFriendReqsFn } from "../libs/apiCalls";

const NavBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logOutMutation } = useLogOut();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: friendReqsData } = useQuery({
    queryKey: ["friendReqs"],
    queryFn: populateFriendReqsFn,
    enabled: Boolean(authUser),
  });
  const pendingCount = friendReqsData?.incomingReqs?.length || 0;

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 shrink-0 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {/* LEFT SIDE: Hamburger Menu (Mobile) & Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              type="button"
              className="btn btn-ghost btn-square min-h-11 min-w-11"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-base-content" />
              ) : (
                <Menu className="size-6 text-base-content" />
              )}
            </button>

            {/* Controlled Dropdown Menu */}
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs top-16"
                  onClick={handleLinkClick}
                  aria-hidden="true"
                />
                <ul
                  id="mobile-nav-menu"
                  className="menu bg-base-200 z-50 fixed top-16 left-0 w-full p-4 shadow-xl border-b border-base-300 rounded-none overflow-y-auto block"
                >
                  <li>
                    <Link
                      to="/"
                      className="text-lg py-3 font-medium"
                      onClick={handleLinkClick}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/friends"
                      className="text-lg py-3 font-medium"
                      onClick={handleLinkClick}
                    >
                      Friends
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/notifications"
                      className="text-lg py-3 font-medium flex items-center justify-between"
                      onClick={handleLinkClick}
                    >
                      <span>Notifications</span>
                      {pendingCount > 0 && (
                        <span className="badge badge-primary badge-sm">
                          {pendingCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="text-lg py-3 font-medium"
                      onClick={handleLinkClick}
                    >
                      Profile
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </div>

          {/* Logo */}
          {isChatPage && (
            <div className="lg:pl-2">
              <Link to="/" className="flex items-center gap-2">
                <BookOpenText className="size-7 sm:size-8 text-primary" />
                <span className="text-lg sm:text-xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider hidden sm:inline-block">
                  Diligent Scholars
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT SIDE: Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Notifications Button */}
          <Link to={"/notifications"} className="hidden sm:inline-flex relative">
            <button
              className="btn btn-info btn-square min-h-11 min-w-11 relative"
              title={`Notifications`}
            >
              <BellIcon className="size-5 sm:size-6 text-base-content opacity-70" />
              {pendingCount > 0 && (
                <span className="badge badge-primary badge-xs absolute -top-1 -right-1 font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          </Link>

          <ThemeSelector />

          <Link to="/profile" title="My profile" className="flex items-center">
            <div className="avatar">
              <div className="w-8 sm:w-10 rounded-lg">
                <img
                  src={authUser?.profileAvatar}
                  alt="User Avatar"
                  rel="noreferrer"
                />
              </div>
            </div>
          </Link>

          <button
            className="btn btn-error btn-square btn-sm sm:btn-md min-h-11 min-w-11 ml-1"
            onClick={() => logOutMutation()}
            title={`Logout`}
          >
            <LogOutIcon className="size-4 sm:size-5 text-base-content opacity-90" />
          </button>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
