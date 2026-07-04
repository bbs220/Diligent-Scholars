import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logInMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { handleApiError } from "../libs/helper";

const useLogIn = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logInMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logInMutationFn,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged in successfully!");
    },

    onError: handleApiError,
  });

  return { logInMutation, isPending, error };
};

export default useLogIn;
