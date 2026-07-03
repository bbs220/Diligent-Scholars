import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import type { typeOnBoardingData } from "../types/typesCollection";
import { CameraIcon, CheckLine, MapPinIcon, ShuffleIcon } from "lucide-react";
import { SKILLS } from "../constants/constantsCollection";
import { useThemeStore } from "../stores/useThemeStore";
import useOnBoarding from "../hooks/useOnBoarding";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();

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

  const handleOnBoarding = (e: React.SubmitEvent) => {
    e.preventDefault();

    onBoardingMutation(onBoardingData);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://api.dicebear.com/10.x/thumbs/svg?borderRadius=6&backgroundColorFill=linear&seed=${idx}`;

    setOnBoardingData({ ...onBoardingData, profileAvatar: randomAvatar });
    toast.success("Random profile picture generated!");
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
            {/* profile avatar: Spans 4 columns and 2 rows on desktop (left side) */}
            <div className="lg:col-span-4 lg:row-span-2 flex flex-col items-center justify-start space-y-3 sm:space-y-4">
              {/* img preview */}
              <div className="size-24 sm:size-28 lg:size-36 rounded-2xl bg-base-300 overflow-hidden shrink-0 shadow-sm">
                {onBoardingData.profileAvatar ? (
                  <img
                    src={onBoardingData.profileAvatar}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-10 sm:size-12 lg:size-14 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* random avatar button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent btn-sm sm:btn-md"
                >
                  <ShuffleIcon className="size-4 mr-1 sm:mr-2" />
                  Random Avatar
                </button>
              </div>
            </div>

            {/* fullname: Takes up remaining 8 columns on the right */}
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

            {/* bio: Takes up remaining 8 columns on the right, under Full Name */}
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

            {/* skills: Full width on bottom, split into 2 columns on medium+ screens */}
            <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
              {/* learned skill */}
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
                  <option>--Subject--</option>
                  {SKILLS.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* learn skill */}
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
                  <option>--Subject--</option>
                  {SKILLS.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* location: Full width at the bottom */}
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

            {/* submit button */}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnBoardingPage;
