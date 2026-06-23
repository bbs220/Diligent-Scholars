import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { onBoardingMutationFn } from "../libs/mutateFns";
import type { typeOnBoardingData } from "../types/typesCollection";
import { CameraIcon, Computer, MapPinIcon, ShuffleIcon } from "lucide-react";
import { SKILLS } from "../constants/constantsCollection";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [onBoardingData, setOnBoardingData] = useState<typeOnBoardingData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    skillToShare: authUser?.skillToShare || "",
    skillToLearn: authUser?.skillToLearn || "",
    location: authUser?.location || "",
    profileAvatar: authUser?.profileAvatar || "",
  });

  const { mutate: onBoardingMutation, isPending } = useMutation({
    mutationFn: onBoardingMutationFn,
    onSuccess: () => {
      toast.success("Onboarding Completed");

      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  const handleOnBoarding = (e: React.SubmitEvent) => {
    e.preventDefault();

    onBoardingMutation(onBoardingData);
  };

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setOnBoardingData({ ...onBoardingData, profileAvatar: randomAvatar });
    toast.success("Random profile picture generated!");
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
            Complete Your Profile
          </h1>

          <form onSubmit={handleOnBoarding} className="space-y-6">
            {/* profile avatar */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* img preview */}
              <div className="size-24 rounded-2xl bg-base-300 overflow-hidden">
                {onBoardingData.profileAvatar ? (
                  <img
                    src={onBoardingData.profileAvatar}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* random avatar button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleRandomAvatar}
                  className="btn btn-accent"
                >
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* fullname */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
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
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={onBoardingData.bio}
                onChange={(e) =>
                  setOnBoardingData({ ...onBoardingData, bio: e.target.value })
                }
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Small description of yourself"
              />
            </div>

            {/* skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* learned skill */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Select your web skill / language you are proficient in
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
                  <option value="">Proficient Skill</option>
                  {SKILLS.map((lang) => (
                    <option key={`native-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* learn skill */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Select the web skill / language you wish to learn
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
                  <option value="">Learning Skill</option>
                  {SKILLS.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* location */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
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
                  placeholder="Where you live"
                />
              </div>
            </div>

            {/* submit button */}
            <button
              className="btn btn-primary w-full"
              disabled={isPending}
              type="submit"
            >
              {!isPending ? (
                <>
                  <Computer className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
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
