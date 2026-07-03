import React, { useState } from "react";
import { BookOpenText, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import useSignUp from "../hooks/useSignUp";
import type { typeSignUpData } from "../types/typesCollection";
import { useThemeStore } from "../stores/useThemeStore";
import SplashArt from "../components/SplashArt";

const SignUpPage = () => {
  const [signUpData, setSignUpData] = useState<typeSignUpData>({
    fullName: "",
    email: "",
    password: "",
  });

  const [isAgreed, setIsAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const { signUpMutation, isPending } = useSignUp();
  const { theme } = useThemeStore();

  const handleSignUp: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();

    if (!isAgreed) {
      toast.error("Please check the box to sign up");
      return;
    }

    signUpMutation(signUpData);
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 md:p-8 font-inter"
      data-theme={theme}
    >
      {/* Added min-h-[600px] md:min-h-[650px] to stabilize container height */}
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden min-h-150 md:min-h-162.5">
        {/* form section */}
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
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    Create an Account
                  </h2>
                  <p className="text-sm opacity-70">
                    Join us and start your learning journey!
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:gap-2">
                  {/* fullname */}
                  <div className="form-control w-full space-y-1 sm:space-y-2">
                    <label className="label">
                      <span className="label-text text-sm sm:text-base">
                        Full Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="input input-bordered w-full"
                      value={signUpData.fullName}
                      onChange={(e) =>
                        setSignUpData({
                          ...signUpData,
                          fullName: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  {/* email */}
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
                      value={signUpData.email}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  {/* password */}
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
                        value={signUpData.password}
                        onChange={(e) =>
                          setSignUpData({
                            ...signUpData,
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
                    <p className="text-xs opacity-70 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>
                  {/* checkbox */}
                  <div className="form-control mt-3 sm:mt-2">
                    <div className="flex items-start sm:items-center justify-start gap-2 sm:gap-3">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm cursor-pointer mt-0.5 sm:mt-0 shrink-0"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <span className="text-xs sm:text-sm leading-tight">
                        I agree to the{" "}
                        <span className="text-primary hover:underline cursor-pointer">
                          terms of service
                        </span>{" "}
                        and{" "}
                        <span className="text-primary hover:underline cursor-pointer">
                          privacy policy
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {/* submit button */}
                <button
                  className="btn btn-primary w-full mt-4 sm:mt-2"
                  type="submit"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-xs" />
                      Loading...
                    </>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>
                {/* link to login */}
                <div className="text-center mt-4">
                  <p className="text-sm">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="text-primary hover:underline font-medium"
                    >
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* splash image section */}
        <SplashArt />
      </div>
    </div>
  );
};

export default SignUpPage;
