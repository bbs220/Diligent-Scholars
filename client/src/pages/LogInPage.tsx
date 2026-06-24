import React, { useState } from "react";
import type { typeLogInData } from "../types/typesCollection";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logInMutationFn } from "../libs/mutateFns";

const LogInPage = () => {
  const [logInData, setLogInData] = useState<typeLogInData>({
    email: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: logInMutation,
    isPending,
    error,
  } = useMutation({
    mutationFn: logInMutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const handleLogIn = (e: React.SubmitEvent) => {
    e.preventDefault();

    logInMutation(logInData);
  };
  return <div>LogInPage</div>;
};

export default LogInPage;
