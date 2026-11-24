import type { typeLayout } from "../types/typesCollection";
import SideBar from "./SideBar";
import NavBar from "./NavBar";

const Layout = ({ children, showSideBar = false }: typeLayout) => {
  return (
    <div className="h-dvh w-full overflow-hidden bg-base-100 font-inter">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn btn-primary btn-sm"
      >
        Skip to content
      </a>
      <div className="flex h-full w-full relative">
        {showSideBar && <SideBar />}

        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <NavBar />
          <main
            id="main-content"
            tabIndex={-1}
            className="flex-1 overflow-y-auto overflow-x-hidden relative focus:outline-none"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
