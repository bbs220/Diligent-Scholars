import type { typeLayout } from "../types/typesCollection";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const Layout = ({ children, showSideBar = false }: typeLayout) => {
  return (
    <div className="h-dvh w-full overflow-hidden bg-base-100 font-inter">
      <div className="flex h-full w-full relative">
        {showSideBar && <SideBar />}

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <NavBar />
          <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
