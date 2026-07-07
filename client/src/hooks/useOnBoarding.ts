import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onBoardingMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { handleApiError } from "../libs/helper";

const useOnBoarding = () => {
  const queryClient = useQueryClient();
  const {
    mutate: onBoardingMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: onBoardingMutationFn,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data?.message || "Onboarding Completed");
    },

    onError: handleApiError,
  });

  return { onBoardingMutation, isPending, error };
};

export default useOnBoarding;
