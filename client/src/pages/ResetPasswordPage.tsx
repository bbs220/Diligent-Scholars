import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { BookOpenText, Eye, EyeOff, KeyRoundIcon, LoaderIcon } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordFn } from "../libs/apiCalls";
import { handleApiError } from "../libs/helper";
import { useThemeStore } from "../stores/useThemeStore";

// reset password page component
const ResetPasswordPage = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeStore();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: resetPasswordMutation, isPending } = useMutation({
    mutationFn: resetPasswordFn,
    onSuccess: (data) => {
      toast.success(data?.message || "Password reset successfully! Please log in.");
      navigate("/login");
    },
    onError: handleApiError,
  });

  const handleSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    resetPasswordMutation({
      token,
      newPassword,
    });
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
          <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-xs sm:text-sm opacity-70">
            Please choose a secure new password for your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* new password */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="reset-new-password">
              <span className="label-text font-medium text-xs sm:text-sm">
                New Password
              </span>
            </label>
            <div className="relative">
              <input
                id="reset-new-password"
                type={showNewPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="At least 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input input-bordered w-full pr-10"
              />
              <button
                type="button"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary transition-colors hover:cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
            <p className="text-[11px] opacity-60">Minimum 6 characters</p>
          </div>

          {/* confirm new password */}
          <div className="form-control space-y-1">
            <label className="label py-0" htmlFor="reset-confirm-password">
              <span className="label-text font-medium text-xs sm:text-sm">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <input
                id="reset-confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input input-bordered w-full pr-10"
              />
              <button
                type="button"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary transition-colors hover:cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-5" />
                ) : (
                  <Eye className="size-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full gap-2 mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <LoaderIcon className="size-4 animate-spin" />
            ) : (
              <KeyRoundIcon className="size-4" />
            )}
            {isPending ? "Resetting..." : "Save New Password"}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="text-xs sm:text-sm text-primary hover:underline font-medium"
            >
              Cancel and Return to Log In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
