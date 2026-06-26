import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logInMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";

const useLogIn = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logInMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logInMutationFn,

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),

    onError: (error) => {
      toast.error(error.response.data.message);
    },
  });

  return { logInMutation, isPending, error };
};
export default useLogIn;
