import { Navigate, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LogInPage from "./pages/LogInPage";
import OnBoardingPage from "./pages/OnBoardingPage";
import NotificationsPage from "./pages/NotificationsPage";
import CallPage from "./pages/CallPage";
import ChatPage from "./pages/ChatPage";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "./libs/axiosInstance";

function App() {
  const {
    data: authData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me");

      return res.data;
    },
  });

  const authUser = authData?.user;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LogInPage /> : <Navigate to="/" />}
        />
        <Route
          path="/onboarding"
          element={authUser ? <OnBoardingPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/notifications"
          element={authUser ? <NotificationsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/call"
          element={authUser ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={authUser ? <ChatPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;
