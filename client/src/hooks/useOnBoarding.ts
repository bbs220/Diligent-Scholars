import { useMutation, useQueryClient } from "@tanstack/react-query";
import { onBoardingMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

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

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to complete onboarding",
        );
      } else {
        toast.error(error.message);
      }
    },
  });

  return { onBoardingMutation, isPending, error };
};
export default useOnBoarding;
