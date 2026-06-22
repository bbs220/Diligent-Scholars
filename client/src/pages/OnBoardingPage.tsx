import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser";
import type { typeOnBoardingData } from "../types/typesCollection";

const OnBoardingPage = () => {
  const { authUser } = useAuthUser();

  const [formState, setFormState] = useState<typeOnBoardingData>({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    skillToShare: authUser?.skillToShare || "",
    skillToLearn: authUser?.skillToLearn || "",
    location: authUser?.location || "",
    profileAvatar: authUser?.profileAvatar || "",
  });

  return <div>OnBoardingPage</div>;
};

export default OnBoardingPage;
