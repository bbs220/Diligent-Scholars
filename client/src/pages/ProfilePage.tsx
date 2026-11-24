import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  EyeOff,
  KeyIcon,
  LoaderIcon,
  MapPinIcon,
  SaveIcon,
  UserIcon,
} from "lucide-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { COUNTRIES, SKILLS } from "../constants/constantsCollection";
import useAuthUser from "../hooks/useAuthUser";
import { changePasswordFn, updateProfileFn } from "../libs/apiCalls";
import { handleApiError } from "../libs/helper";
import type { typeOnBoardingData } from "../types/typesCollection";

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

  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [imageError, setImageError] = useState(false);

  const [profileData, setProfileData] = useState<typeOnBoardingData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    skillToShare: authUser?.skillToShare || "",
    skillToLearn: authUser?.skillToLearn || "",
    location: authUser?.location || "",
    profileAvatar: authUser?.profileAvatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="flex border-b border-base-300 gap-2">
          <button
            type="button"
            className={`btn btn-sm sm:btn-md rounded-b-none gap-2 ${
              activeTab === "profile" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon className="size-4" />
            Profile Details
          </button>
          <button
            type="button"
            className={`btn btn-sm sm:btn-md rounded-b-none gap-2 ${
              activeTab === "security" ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <KeyIcon className="size-4" />
            Security & Password
          </button>
        </div>

        {activeTab === "profile" ? (
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
                  <div className="flex-1 w-full space-y-2">
                    <label className="label py-0" htmlFor="profile-avatar">
                      <span className="label-text font-medium">
                        Avatar Image URL
                      </span>
                    </label>
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
                      className="input input-bordered w-full"
                      placeholder="https://example.com/avatar.jpg"
                    />
                    <p className="text-xs opacity-60">
                      Direct link to your avatar image (Gravatar, Unsplash, etc.)
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
        ) : (
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
