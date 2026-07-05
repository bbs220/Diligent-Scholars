import { createBrowserRouter } from "react-router";
import { RootComponent, RequireAuth, RequireGuest } from "./App";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import Layout from "./components/Layout";

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
            <CallPage />
          </RequireAuth>
        ),
      },
      {
        path: "/chat/:id",
        element: (
          <RequireAuth>
            <Layout showSideBar={false}>
              <ChatPage />
            </Layout>
          </RequireAuth>
        ),
      },
    ],
  },
]);
