import { useQuery } from "@tanstack/react-query";
import { getAuthUserFn } from "../libs/mutateFns";

const useAuthUser = () => {
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUserFn,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
