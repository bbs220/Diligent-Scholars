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

    onSuccess: () => {
      toast.success("Onboarding Completed");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },

    onError: handleApiError,
  });

  return { onBoardingMutation, isPending, error };
};

export default useOnBoarding;
