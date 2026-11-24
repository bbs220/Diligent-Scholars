import { lazy, Suspense } from "react";
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

const CallPage = lazy(() => import("./pages/CallPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

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
        element: (
          <RequireAuth>
            <Suspense fallback={<PageLoader />}>
              <CallPage />
            </Suspense>
          </RequireAuth>
        ),
      },
      {
        path: "/chat/:id",
        element: (
          <RequireAuth>
            <Layout showSideBar={false}>
              <Suspense fallback={<PageLoader />}>
                <ChatPage />
              </Suspense>
            </Layout>
          </RequireAuth>
        ),
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
