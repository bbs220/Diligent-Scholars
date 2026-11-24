import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangleIcon,
  Eye,
  EyeOff,
  KeyIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  ShieldOffIcon,
  SparklesIcon,
  Trash2Icon,
  UploadIcon,
  UserCheckIcon,
  UserIcon,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  AVATAR_PRESETS,
  COUNTRIES,
  SKILLS,
} from "../constants/constantsCollection";
import useAuthUser from "../hooks/useAuthUser";
import {
  changePasswordFn,
  deleteAccountFn,
  getBlockedUsersFn,
  unblockUserFn,
  updateProfileFn,
} from "../libs/apiCalls";
import { capitalize, compressImageFile, handleApiError } from "../libs/helper";
import type { typeOnBoardingData, typeUser } from "../types/typesCollection";

// helper to format initials
const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { authUser } = useAuthUser();

  const [activeTab, setActiveTab] = useState<
    "profile" | "security" | "blocked"
  >("profile");
  const [imageError, setImageError] = useState(false);

  // state for avatar preset modal visibility
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // state for photo upload processing
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // file input reference for photo picker
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<typeOnBoardingData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    skillToShare: authUser?.skillToShare || "",
    skillToLearn: authUser?.skillToLearn || "",
    location: authUser?.location || "",
    profileAvatar: authUser?.profileAvatar || "",
  });

  // fetch users blocked by current user
  const { data: blockedUsers = [], isLoading: isLoadingBlocked } = useQuery<
    typeUser[]
  >({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsersFn,
  });

  // unblock a user mutation
  const { mutate: unblockMutation, isPending: isUnblocking } = useMutation({
    mutationFn: unblockUserFn,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["recommendedUsers"] });
      toast.success(data?.message || "User unblocked successfully");
    },
    onError: handleApiError,
  });

  // handle photo upload and client compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const compressedDataUrl = await compressImageFile(file);
      setImageError(false);
      setProfileData((prev) => ({
        ...prev,
        profileAvatar: compressedDataUrl,
      }));
      toast.success("Photo processed successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process image",
      );
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const { mutate: updateProfileMutation, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: updateProfileFn,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["authUser"] });
        toast.success(data?.message || "Profile updated successfully!");
      },
      onError: handleApiError,
    });

  const { mutate: changePasswordMutation, isPending: isChangingPassword } =
    useMutation({
      mutationFn: changePasswordFn,
      onSuccess: (data) => {
        toast.success(data?.message || "Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      },
      onError: handleApiError,
    });

  const { mutate: deleteAccountMutation, isPending: isDeletingAccount } =
    useMutation({
      mutationFn: deleteAccountFn,
      onSuccess: () => {
        toast.success("Account deleted successfully");
        queryClient.clear();
        window.location.href = "/login";
      },
      onError: handleApiError,
    });

  const handleProfileSubmit: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    updateProfileMutation(profileData);
  };

  const handlePasswordSubmit: React.ComponentProps<"form">["onSubmit"] = (
    e,
  ) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }
    changePasswordMutation({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
  };

  const initials = getInitials(profileData.fullName || authUser?.fullName || "");

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto font-inter">
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Account & Profile Settings
          </h1>
          <p className="text-sm opacity-70 mt-1">
            Manage your personal profile information and login security
          </p>
        </div>

        {/* tabs */}
        <div className="flex border-b border-base-300 gap-2 overflow-x-auto">
          <button
            type="button"
            className={`btn btn-sm sm:btn-md rounded-b-none gap-2 shrink-0 ${
              activeTab === "profile" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon className="size-4" />
            Profile Details
          </button>
          <button
            type="button"
            className={`btn btn-sm sm:btn-md rounded-b-none gap-2 shrink-0 ${
              activeTab === "security" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <KeyIcon className="size-4" />
            Security & Password
          </button>
          <button
            type="button"
            className={`btn btn-sm sm:btn-md rounded-b-none gap-2 shrink-0 ${
              activeTab === "blocked" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setActiveTab("blocked")}
          >
            <ShieldOffIcon className="size-4" />
            Blocked Users
            {blockedUsers.length > 0 && (
              <span className="badge badge-sm badge-neutral">
                {blockedUsers.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-5 sm:p-8">
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* avatar preview */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-base-300">
                  <div className="size-24 sm:size-28 rounded-2xl bg-base-300 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                    {profileData.profileAvatar && !imageError ? (
                      <img
                        src={profileData.profileAvatar}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-base-300 text-base-content text-3xl font-bold opacity-70">
                        {initials}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <label className="label py-0" htmlFor="profile-avatar">
                      <span className="label-text font-medium">
                        Profile Avatar
                      </span>
                    </label>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingPhoto || isUpdatingProfile}
                        className="btn btn-outline btn-sm gap-1.5"
                      >
                        {isUploadingPhoto ? (
                          <LoaderIcon className="size-4 animate-spin" />
                        ) : (
                          <UploadIcon className="size-4" />
                        )}
                        {isUploadingPhoto ? "Processing..." : "Upload Photo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPresetModalOpen(true)}
                        disabled={isUploadingPhoto || isUpdatingProfile}
                        className="btn btn-ghost btn-sm gap-1.5 border border-base-300"
                      >
                        <SparklesIcon className="size-4 text-primary" />
                        Choose Preset
                      </button>
                    </div>

                    <input
                      id="profile-avatar"
                      type="url"
                      value={profileData.profileAvatar}
                      onChange={(e) => {
                        setImageError(false);
                        setProfileData({
                          ...profileData,
                          profileAvatar: e.target.value,
                        });
                      }}
                      className="input input-bordered w-full text-xs sm:text-sm"
                      placeholder="Or enter direct image URL (https://...)"
                    />
                    <p className="text-xs opacity-60">
                      Upload an image file, choose a scholar preset, or enter an image URL
                    </p>
                  </div>
                </div>

                {/* full name */}
                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="profile-fullname">
                    <span className="label-text font-medium">Full Name</span>
                  </label>
                  <input
                    id="profile-fullname"
                    type="text"
                    value={profileData.fullName}
                    autoComplete="name"
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                {/* bio */}
                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="profile-bio">
                    <span className="label-text font-medium">Bio</span>
                  </label>
                  <textarea
                    id="profile-bio"
                    value={profileData.bio}
                    onChange={(e) =>
                      setProfileData({ ...profileData, bio: e.target.value })
                    }
                    className="textarea textarea-bordered h-24 w-full"
                    placeholder="Tell other scholars about your learning goals and interests..."
                  />
                </div>

                {/* skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="form-control space-y-1">
                    <label
                      className="label py-1"
                      htmlFor="profile-skillToShare"
                    >
                      <span className="label-text font-medium">
                        Subject you can share
                      </span>
                    </label>
                    <select
                      id="profile-skillToShare"
                      value={profileData.skillToShare}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          skillToShare: e.target.value,
                        })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="" disabled>
                        -- Select Subject --
                      </option>
                      {SKILLS.map((skill) => (
                        <option
                          key={`share-${skill}`}
                          value={skill.toLowerCase()}
                        >
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control space-y-1">
                    <label
                      className="label py-1"
                      htmlFor="profile-skillToLearn"
                    >
                      <span className="label-text font-medium">
                        Subject you wish to learn
                      </span>
                    </label>
                    <select
                      id="profile-skillToLearn"
                      value={profileData.skillToLearn}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          skillToLearn: e.target.value,
                        })
                      }
                      className="select select-bordered w-full"
                    >
                      <option value="" disabled>
                        -- Select Subject --
                      </option>
                      {SKILLS.map((skill) => (
                        <option
                          key={`learn-${skill}`}
                          value={skill.toLowerCase()}
                        >
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* location */}
                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="profile-location">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <MapPinIcon className="size-5 text-base-content opacity-70" />
                    </div>
                    <select
                      id="profile-location"
                      value={profileData.location}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          location: e.target.value,
                        })
                      }
                      className="select select-bordered w-full pl-10"
                    >
                      <option value="" disabled>
                        -- Select Country --
                      </option>
                      {profileData.location &&
                        !COUNTRIES.includes(profileData.location) && (
                          <option value={profileData.location}>
                            {profileData.location}
                          </option>
                        )}
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary min-w-32"
                    disabled={isUpdatingProfile}
                  >
                    {isUpdatingProfile ? (
                      <>
                        <LoaderIcon className="animate-spin size-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="size-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="card bg-base-200 shadow-md max-w-xl">
            <div className="card-body p-5 sm:p-8">
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="current-password">
                    <span className="label-text font-medium">
                      Current Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      autoComplete="current-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="input input-bordered w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/50 hover:text-primary transition-colors hover:cursor-pointer"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="new-password">
                    <span className="label-text font-medium">
                      New Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="input input-bordered w-full pr-10"
                      required
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
                  <p className="text-xs opacity-60">
                    Minimum 6 characters
                  </p>
                </div>

                <div className="form-control space-y-1">
                  <label className="label py-1" htmlFor="confirm-password">
                    <span className="label-text font-medium">
                      Confirm New Password
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      autoComplete="new-password"
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="input input-bordered w-full pr-10"
                      required
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

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary min-w-36"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? (
                      <>
                        <LoaderIcon className="animate-spin size-4" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <KeyIcon className="size-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* danger zone */}
            <div className="card bg-base-200 border border-error/30 shadow-md max-w-xl mt-6">
              <div className="card-body p-5 sm:p-8 space-y-3">
                <h3 className="font-bold text-lg text-error flex items-center gap-2">
                  <AlertTriangleIcon className="size-5" />
                  Danger Zone
                </h3>
                <p className="text-sm opacity-70">
                  Permanently delete your account, learning history, friend connections, and profile data. This action cannot be undone.
                </p>
                <div className="pt-2 flex justify-start">
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="btn btn-outline btn-error btn-sm sm:btn-md gap-2"
                  >
                    <Trash2Icon className="size-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* blocked users list tab */}
        {activeTab === "blocked" && (
          <div className="card bg-base-200 shadow-md">
            <div className="card-body p-5 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <ShieldOffIcon className="size-5 text-warning" />
                  Blocked Users History
                </h2>
                <p className="text-xs sm:text-sm opacity-70 mt-1">
                  Scholars you have blocked cannot message you, call you, or see your profile in recommendations
                </p>
              </div>

              {isLoadingBlocked ? (
                <div className="flex justify-center p-8">
                  <LoaderIcon className="size-8 animate-spin text-primary" />
                </div>
              ) : blockedUsers.length === 0 ? (
                <div className="card bg-base-100 p-8 text-center space-y-3 border border-base-300">
                  <UserCheckIcon className="size-10 text-success mx-auto opacity-70" />
                  <p className="font-semibold text-base sm:text-lg">No Blocked Scholars</p>
                  <p className="text-xs sm:text-sm opacity-70 max-w-sm mx-auto">
                    You have not blocked any users. If you block someone, they will appear here so you can unblock them at any time
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {blockedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="card bg-base-100 border border-base-300 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Link
                          to={`/user/${user._id}`}
                          className="avatar size-12 rounded-xl shrink-0 hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={user.profileAvatar}
                            alt={user.fullName}
                            className="object-cover rounded-xl"
                          />
                        </Link>
                        <div className="min-w-0">
                          <Link
                            to={`/user/${user._id}`}
                            className="font-semibold text-base truncate block hover:underline"
                          >
                            {user.fullName}
                          </Link>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1">
                            {user.skillToShare && (
                              <span className="badge badge-success badge-xs">
                                📘 {capitalize(user.skillToShare)}
                              </span>
                            )}
                            {user.skillToLearn && (
                              <span className="badge badge-warning badge-xs">
                                📖 {capitalize(user.skillToLearn)}
                              </span>
                            )}
                            {user.location && (
                              <span className="text-xs opacity-60 flex items-center ml-1">
                                <MapPinIcon className="size-3 mr-0.5 inline" />
                                {user.location}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => unblockMutation(user._id)}
                        disabled={isUnblocking}
                        className="btn btn-outline btn-warning btn-sm gap-1 self-end sm:self-auto shrink-0"
                      >
                        <UserCheckIcon className="size-4" />
                        {isUnblocking ? "Unblocking..." : "Unblock Scholar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* delete account modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="card bg-base-100 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="font-bold text-lg text-error flex items-center gap-2">
              <AlertTriangleIcon className="size-5" />
              Confirm Account Deletion
            </h3>
            <p className="text-sm opacity-80">
              Please enter your password to confirm account deletion. All your data and connections will be permanently wiped.
            </p>
            <div className="form-control space-y-1">
              <label className="label py-1" htmlFor="delete-confirm-password">
                <span className="label-text font-medium text-xs">
                  Your Password
                </span>
              </label>
              <input
                id="delete-confirm-password"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="input input-bordered w-full"
                placeholder="Enter password to verify"
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setDeletePassword("");
                }}
                disabled={isDeletingAccount}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error btn-sm"
                onClick={() => deleteAccountMutation(deletePassword)}
                disabled={isDeletingAccount || !deletePassword}
              >
                {isDeletingAccount ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* avatar preset selection modal */}
      {isPresetModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              <SparklesIcon className="size-5 text-primary" />
              Choose a Scholar Avatar
            </h3>
            <p className="text-xs opacity-70 mb-4">
              Pick one of our illustrated scholar avatar presets
            </p>
            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-h-72 overflow-y-auto p-1">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setImageError(false);
                    setProfileData((prev) => ({
                      ...prev,
                      profileAvatar: preset.url,
                    }));
                    setIsPresetModalOpen(false);
                  }}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all hover:border-primary hover:scale-105 ${
                    profileData.profileAvatar === preset.url
                      ? "border-primary bg-primary/10 ring-2 ring-primary"
                      : "border-base-300 bg-base-100"
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="size-12 rounded-lg object-cover"
                  />
                  <span className="text-[10px] font-medium mt-1 truncate w-full text-center">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsPresetModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setIsPresetModalOpen(false)}
          >
            <button type="button">close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
