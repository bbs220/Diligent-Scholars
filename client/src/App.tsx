import { Navigate, Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import React from "react";
import PageLoader from "./components/PageLoader";
import useAuthUser from "./hooks/useAuthUser";
import { useThemeStore } from "./stores/useThemeStore";

export const RootComponent = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();

  if (isLoading) return <PageLoader />;

  return (
    <div
      className="h-dvh w-full overflow-x-hidden font-inter"
      data-theme={theme}
    >
      <Outlet
        context={{
          isAuthenticated: Boolean(authUser),
          isOnBoarded: authUser?.isOnboarded,
        }}
      />
      <Toaster position="bottom-right" />
    </div>
  );
};

export const RequireAuth = ({
  children,
  requireOnboard = true,
}: {
  children: React.ReactNode;
  requireOnboard?: boolean;
}) => {
  const { authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  const isOnBoarded = authUser?.isOnboarded;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requireOnboard && !isOnBoarded) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOnboard && isOnBoarded) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const RequireGuest = ({ children }: { children: React.ReactNode }) => {
  const { authUser } = useAuthUser();
  if (authUser)
    return <Navigate to={authUser.isOnboarded ? "/" : "/onboarding"} replace />;
  return <>{children}</>;
};
