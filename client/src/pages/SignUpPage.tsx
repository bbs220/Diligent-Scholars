import React, { useState } from "react";
import { Computer, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import useSignUp from "../hooks/useSignUp";
import type { typeSignUpData } from "../types/typesCollection";
import { useThemeStore } from "../stores/useThemeStore";

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
      className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 font-inter"
      data-theme={theme}
    >
      <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
        {/* form section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
          {/* logo */}
          <div className="mb-4 flex items-center justify-start gap-2">
            <Computer className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">
              Social App
            </span>
          </div>
          {/* form */}
          <div className="w-full">
            <form onSubmit={handleSignUp}>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">Create an Account</h2>
                  <p className="text-sm opacity-70">
                    Join us and start your web skills learning journey!
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  {/* fullname */}
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Full Name</span>
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
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Email</span>
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
                  <div className="form-control w-full space-y-2">
                    <label className="label">
                      <span className="label-text">Password</span>
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
                  <div className="form-control mt-2">
                    <div className="flex items-center justify-start gap-2">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm cursor-pointer"
                        checked={isAgreed}
                        onChange={(e) => setIsAgreed(e.target.checked)}
                      />
                      <span className="text-xs leading-tight">
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
                  className="btn btn-primary w-full mt-2"
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
                    <Link to="/login" className="text-primary hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* splash image section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* image */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img
                src="/images/checked.png"
                alt="Checkbox checked illustration"
                className="w-full h-full"
              />
            </div>
            {/* splash description */}
            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">
                Connect with skilled developers worldwide
              </h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your web
                skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
