import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOutMutationFn } from "../libs/apiCalls";
import toast from "react-hot-toast";
import { handleApiError } from "../libs/helper";

const useLogOut = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logOutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logOutMutationFn,

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success(data?.message || "Logged out successfully!");
    },

    onError: handleApiError,
  });

  return { logOutMutation, isPending, error };
};
export default useLogOut;
