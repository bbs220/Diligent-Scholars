import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import useAuthUser from "../hooks/useAuthUser";
import { onBoardingMutationFn } from "../libs/mutateFns";
import type { typeOnBoardingData } from "../types/typesCollection";

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
  });

  const handleOnBoarding = (e: React.SubmitEvent) => {
    e.preventDefault();

    onBoardingMutation(onBoardingData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-base-100">
      OnBoardingPage
    </div>
  );
};

export default OnBoardingPage;
