import React, { useState } from "react";
import { Link } from "react-router";
import { BookOpenText, Eye, EyeOff } from "lucide-react";
import useLogIn from "../hooks/useLogIn";
import type { typeLogInData } from "../types/typesCollection";
import { useThemeStore } from "../stores/useThemeStore";
import SplashArt from "../components/SplashArt";

const LogInPage = () => {
  const [logInData, setLogInData] = useState<typeLogInData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const { logInMutation, isPending } = useLogIn();
  const { theme } = useThemeStore();

  const handleLogIn: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    logInMutation(logInData);
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 md:p-8 font-inter"
      data-theme={theme}
    >
      {/* Added min-h-[600px] md:min-h-[650px] to match SignUpPage exactly */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden min-h-150 md:min-h-162.5">
        {/* login sections */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-6 flex items-center justify-start gap-2">
            <BookOpenText className="size-8 sm:size-9 text-primary shrink-0" />
            <span className="text-2xl sm:text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
              Diligent Scholars
            </span>
          </div>
          {/* form */}
          <div className="w-full">
            <form onSubmit={handleLogIn}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Welcome Back
                  </h2>
                  <p className="text-sm opacity-70">
                    Log In to your account to continue your learning journey!
                  </p>
                </div>
                {/* email */}
                <div className="flex flex-col gap-3 sm:gap-2">
                  <div className="form-control w-full space-y-1 sm:space-y-2">
                    <label className="label">
                      <span className="label-text text-sm sm:text-base">
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="input input-bordered w-full"
                      value={logInData.email}
                      onChange={(e) =>
                        setLogInData({ ...logInData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  {/* password section updated */}
                  <div className="form-control w-full space-y-1 sm:space-y-2">
                    <label className="label">
                      <span className="label-text text-sm sm:text-base">
                        Password
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Your Password"
                        className="input input-bordered w-full pr-10"
                        value={logInData.password}
                        onChange={(e) =>
                          setLogInData({
                            ...logInData,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary transition-colors hover:cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="size-5" />
                        ) : (
                          <Eye className="size-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {/* submit button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-full mt-4 sm:mt-6"
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Logging In...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </button>
                  {/* link to signup */}
                  <div className="text-center mt-4">
                    <p className="text-sm">
                      Don't have an account?{" "}
                      <Link
                        to="/signup"
                        className="text-primary hover:underline font-medium"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* img section */}
        <SplashArt />
      </div>
    </div>
  );
};

export default LogInPage;
