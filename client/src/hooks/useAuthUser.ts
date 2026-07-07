import { useQuery } from "@tanstack/react-query";
import { getAuthUserFn } from "../libs/apiCalls";
import type { typeUser } from "../types/typesCollection";

const useAuthUser = () => {
  const authUser = useQuery<typeUser>({
    queryKey: ["authUser"],
    queryFn: getAuthUserFn,
    retry: false,
  });

  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data,
  };
};

export default useAuthUser;
