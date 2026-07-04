import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { handleApiError } from "../libs/helper";

const useSignUp = () => {
  const queryClient = useQueryClient();

  const {
    mutate: signUpMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: signUpMutationFn,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Account created successfully!");
    },

    onError: handleApiError,
  });

  return { signUpMutation, isPending, error };
};

export default useSignUp;
