import { createBrowserRouter } from "react-router";
import { RootComponent, RequireAuth, RequireGuest } from "./App";
import PageLoader from "./components/PageLoader";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import NotificationsPage from "./pages/NotificationsPage";
import Layout from "./components/Layout";
import NotFoundPage from "./pages/NotFoundPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfilePage from "./pages/UserProfilePage";
import FriendsPage from "./pages/FriendsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export const coreRouter = createBrowserRouter([
  {
    element: <RootComponent />,
    children: [
      {
        path: "/",
        element: (
          <RequireAuth>
            <Layout showSideBar>
              <HomePage />
            </Layout>
          </RequireAuth>
        ),
      },
      {
        path: "/friends",
        element: (
          <RequireAuth>
            <Layout showSideBar>
              <FriendsPage />
            </Layout>
          </RequireAuth>
        ),
      },
      {
        path: "/signup",
        element: (
          <RequireGuest>
            <SignUpPage />
          </RequireGuest>
        ),
      },
      {
        path: "/login",
        element: (
          <RequireGuest>
            <LogInPage />
          </RequireGuest>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <RequireGuest>
            <ForgotPasswordPage />
          </RequireGuest>
        ),
      },
      {
        path: "/reset-password/:token",
        element: (
          <RequireGuest>
            <ResetPasswordPage />
          </RequireGuest>
        ),
      },
      {
        path: "/onboarding",
        element: (
          <RequireAuth requireOnboard={false}>
            <OnBoardingPage />
          </RequireAuth>
        ),
      },
      {
        path: "/notifications",
        element: (
          <RequireAuth>
            <Layout showSideBar>
              <NotificationsPage />
            </Layout>
          </RequireAuth>
        ),
      },
      {
        path: "/call/:id",
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { default: CallPage } = await import("./pages/CallPage");
          return {
            element: (
              <RequireAuth>
                <CallPage />
              </RequireAuth>
            ),
          };
        },
      },
      {
        path: "/chat/:id",
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { default: ChatPage } = await import("./pages/ChatPage");
          return {
            element: (
              <RequireAuth>
                <Layout showSideBar={false}>
                  <ChatPage />
                </Layout>
              </RequireAuth>
            ),
          };
        },
      },
      {
        path: "/profile",
        element: (
          <RequireAuth>
            <Layout showSideBar>
              <ProfilePage />
            </Layout>
          </RequireAuth>
        ),
      },
      {
        path: "/user/:id",
        element: (
          <RequireAuth>
            <Layout showSideBar>
              <UserProfilePage />
            </Layout>
          </RequireAuth>
        ),
      },
      {
        path: "/terms",
        element: <TermsPage />,
      },
      {
        path: "/privacy",
        element: <PrivacyPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
