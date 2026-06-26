import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUpMutationFn } from "../libs/mutateFns";
import toast from "react-hot-toast";

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
      toast.error(error.response.data.message);
    },
  });

  return { signUpMutation, isPending, error };
};
export default useSignUp;
