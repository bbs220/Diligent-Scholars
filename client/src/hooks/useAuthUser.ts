import { useQuery } from "@tanstack/react-query";
import { getAuthUserFn } from "../libs/apiCalls";
import type { AuthResponse } from "../types/typesCollection";

const useAuthUser = () => {
  const authUser = useQuery<AuthResponse, Error>({
    queryKey: ["authUser"],
    queryFn: getAuthUserFn,
    retry: false,
  });

  return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
};

export default useAuthUser;
