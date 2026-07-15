import React, { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import type { typeOnBoardingData } from "../types/typesCollection";
import { CheckLine, MapPinIcon, LogOutIcon } from "lucide-react";
import { SKILLS } from "../constants/constantsCollection";
import { useThemeStore } from "../stores/useThemeStore";
import useOnBoarding from "../hooks/useOnBoarding";
import useLogOut from "../hooks/useLogOut";

// helper function to generate initials
const getInitials = (name: string) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const { logOutMutation } = useLogOut();

  // State for tracking image load errors
  const [imageError, setImageError] = useState(false);

  const [onBoardingData, setOnBoardingData] = useState<typeOnBoardingData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    skillToShare: authUser?.skillToShare || "",
    skillToLearn: authUser?.skillToLearn || "",
    location: authUser?.location || "",
    profileAvatar: authUser?.profileAvatar || "",
  });

  const { onBoardingMutation, isPending } = useOnBoarding();

  const { theme } = useThemeStore();

  const initials = getInitials(onBoardingData.fullName);

  const handleOnBoarding: React.ComponentProps<"form">["onSubmit"] = (e) => {
    e.preventDefault();
    onBoardingMutation(onBoardingData);
  };

  return (
    <div
      className="min-h-dvh bg-base-100 flex items-center justify-center p-4 sm:p-6 font-inter"
      data-theme={theme}
    >
      <div className="card bg-base-200 w-full max-w-4xl shadow-xl mx-auto">
        <div className="card-body p-6 sm:p-8 lg:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 lg:mb-5">
            Complete Your Profile
          </h1>

          <form
            onSubmit={handleOnBoarding}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-x-6 lg:gap-y-4"
          >
            {/* profile avatar: Spans 4 columns and 2 rows on desktop */}
            <div className="lg:col-span-4 lg:row-span-2 flex flex-col items-center justify-start space-y-3 sm:space-y-4">
              <div className="size-24 sm:size-28 lg:size-36 rounded-2xl bg-base-300 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                {onBoardingData.profileAvatar && !imageError ? (
                  <img
                    src={onBoardingData.profileAvatar}
                    alt={onBoardingData.fullName || "Profile"}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-base-300 text-base-content text-4xl font-bold opacity-70">
                    {initials}
                  </div>
                )}
              </div>
            </div>

            {/* fullname */}
            <div className="lg:col-span-8 form-control space-y-1">
              <label className="label py-1">
                <span className="label-text text-sm sm:text-base">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                name="fullName"
                value={onBoardingData.fullName}
                onChange={(e) =>
                  setOnBoardingData({
                    ...onBoardingData,
                    fullName: e.target.value,
                  })
                }
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* bio */}
            <div className="lg:col-span-8 form-control space-y-1">
              <label className="label py-1">
                <span className="label-text text-sm sm:text-base">Bio</span>
              </label>
              <textarea
                name="bio"
                value={onBoardingData.bio}
                onChange={(e) =>
                  setOnBoardingData({ ...onBoardingData, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24 lg:h-28 w-full"
                placeholder="Small description of yourself."
              />
            </div>

            {/* skills */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              <div className="form-control space-y-1">
                <label className="label py-1">
                  <span className="label-text text-sm sm:text-base">
                    Subject you are good at
                  </span>
                </label>
                <select
                  name="skillToShare"
                  value={onBoardingData.skillToShare}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      skillToShare: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    --Subject--
                  </option>
                  {SKILLS.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control space-y-1">
                <label className="label py-1">
                  <span className="label-text text-sm sm:text-base">
                    Subject you wish to learn
                  </span>
                </label>
                <select
                  name="skillToLearn"
                  value={onBoardingData.skillToLearn}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      skillToLearn: e.target.value,
                    })
                  }
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    --Subject--
                  </option>
                  {SKILLS.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* location */}
            <div className="lg:col-span-12 form-control space-y-1">
              <label className="label py-1">
                <span className="label-text text-sm sm:text-base">
                  Location
                </span>
              </label>
              <div className="relative">
                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70 z-10 pointer-events-none" />
                <input
                  type="text"
                  name="location"
                  value={onBoardingData.location}
                  onChange={(e) =>
                    setOnBoardingData({
                      ...onBoardingData,
                      location: e.target.value,
                    })
                  }
                  className="input input-bordered w-full pl-10"
                  placeholder="Where do you live?"
                />
              </div>
            </div>

            {/* submit */}
            <button
              className="lg:col-span-12 btn btn-primary w-full mt-2"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <CheckLine className="size-5 mr-1 sm:mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-1 sm:mr-2" />
                  Onboarding...
                </>
              )}
            </button>

            {/* logout */}
            <button
              className="lg:col-span-12 btn btn-ghost text-error w-full mt-1"
              type="button"
              onClick={() => logOutMutation()}
              disabled={isPending}
            >
              <LogOutIcon className="size-5 mr-1 sm:mr-2" />
              Logout Instead
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
