"use client"

import { PostUser } from "@/app/actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";

const CreateUser = () => {
  const { toast } = useToast();
  const { mutate } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: PostUser,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError while creating user",
        variant: "destructive",
      }),
    onSuccess: () =>
      toast({
        title: "Group created",
        description: "Group created successfully",
      }),
  });
  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div>
      <LoginLink>Login</LoginLink>
      <LogoutLink>Logout</LogoutLink>
    </div>
  );
};

export default CreateUser;
