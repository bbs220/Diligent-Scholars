import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logOutMutationFn } from "../libs/apiCalls";

const useLogOut = () => {
  const queryClient = useQueryClient();

  const {
    mutate: logOutMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logOutMutationFn,

    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  return { logOutMutation, isPending, error };
};
export default useLogOut;
