import { useState } from "react";
import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, BookOpenText, LogOutIcon, Menu, X } from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import useLogOut from "../hooks/useLogOut";

const NavBar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  const { logOutMutation } = useLogOut();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 shrink-0 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        {/* LEFT SIDE: Hamburger Menu (Mobile) & Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              type="button"
              className="btn btn-ghost btn-square"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="size-6 text-base-content" />
              ) : (
                <Menu className="size-6 text-base-content" />
              )}
            </button>

            {/* Controlled Dropdown Menu */}
            {isMobileMenuOpen && (
              <ul className="menu bg-base-200 z-100 fixed top-16 left-0 w-full h-[75dvh] p-4 shadow-xl border-b border-base-300 rounded-none overflow-y-auto block">
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
                    to="/notifications"
                    className="text-lg py-3 font-medium"
                    onClick={handleLinkClick}
                  >
                    Notifications
                  </Link>
                </li>
              </ul>
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
          <Link to={"/notifications"} className="hidden sm:inline-flex">
            <button className="btn btn-info btn-square" title={`Notifications`}>
              <BellIcon className="size-5 sm:size-6 text-base-content opacity-70" />
            </button>
          </Link>

          <ThemeSelector />

          <div className="avatar">
            <div className="w-8 sm:w-10 rounded-lg">
              <img
                src={authUser?.profileAvatar}
                alt="User Avatar"
                rel="noreferrer"
              />
            </div>
          </div>

          <button
            className="btn btn-error btn-square btn-sm sm:btn-md ml-1"
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
