import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { BookOpenText, KeyRoundIcon, LoaderIcon, MailIcon, ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordFn } from "../libs/apiCalls";
import { handleApiError } from "../libs/helper";
import { useThemeStore } from "../stores/useThemeStore";

// forgot password page component
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const { mutate: forgotPasswordMutation, isPending } = useMutation({
    mutationFn: forgotPasswordFn,
    onSuccess: (data) => {
      toast.success(data?.message || "Reset link generated");
      if (data?.data?.resetToken) {
        setResetToken(data.data.resetToken);
      }
    },
    onError: handleApiError,
  });

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    forgotPasswordMutation({ email: email.trim() });
  };

  return (
    <div
      className="min-h-dvh flex items-center justify-center p-4 sm:p-6 font-inter bg-base-100"
      data-theme={theme}
    >
      <div className="card bg-base-200 w-full max-w-md shadow-xl border border-primary/20 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <BookOpenText className="size-8 text-primary" />
            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary">
              Diligent Scholars
            </span>
          </div>
          <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
            <KeyRoundIcon className="size-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
          <p className="text-xs sm:text-sm opacity-70">
            Enter your registered email address to receive password reset instructions
          </p>
        </div>

        {resetToken ? (
          <div className="space-y-4">
            <div className="alert alert-success text-xs sm:text-sm">
              <span>Password reset instructions have been generated successfully!</span>
            </div>
            <p className="text-xs opacity-70 text-center">
              A secure password reset token has been issued for your account. Click below to set a new password.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/reset-password/${resetToken}`)}
              className="btn btn-primary w-full"
            >
              Proceed to Set New Password
            </button>
            <div className="text-center pt-2">
              <Link to="/login" className="btn btn-ghost btn-sm gap-1">
                <ArrowLeftIcon className="size-3.5" />
                Back to Log In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control space-y-1">
              <label className="label py-0" htmlFor="forgot-email">
                <span className="label-text font-medium text-xs sm:text-sm">
                  Email Address
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-base-content/50">
                  <MailIcon className="size-4" />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="scholar@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-9"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full gap-2"
              disabled={isPending}
            >
              {isPending ? (
                <LoaderIcon className="size-4 animate-spin" />
              ) : (
                <MailIcon className="size-4" />
              )}
              {isPending ? "Generating..." : "Send Reset Link"}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs sm:text-sm text-primary hover:underline font-medium inline-flex items-center gap-1"
              >
                <ArrowLeftIcon className="size-3.5" />
                Back to Log In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
