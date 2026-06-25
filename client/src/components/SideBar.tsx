import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { ComputerIcon } from "lucide-react";

const SideBar = () => {
  const { authUser } = useAuthUser();

  const location = useLocation();
  const currentPath = location.pathname;

  console.log(`current path: ${currentPath}`);

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <Link to={"/"} className="flex items-center justify-center gap-2.5">
          <ComputerIcon className="size-9 text-primary" />
          <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
            Social App
          </span>
        </Link>
      </div>

      <nav></nav>
    </aside>
  );
};
export default SideBar;
