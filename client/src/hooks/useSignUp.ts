import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpMutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),

    onError: (error) => {
      if (isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Signup failed");
      } else {
        toast.error(error.message);
      }
    },
  });

  return { signUpMutation, isPending, error };
};

export default useSignUp;
