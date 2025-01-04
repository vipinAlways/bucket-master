"use client";
import React from "react";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { targetAchieved } from "@/app/actions/bucketList-action/bucketlist-action";
import { useToast } from "@/hooks/use-toast";

const OnholdProof = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationKey: ["onhold"],
    mutationFn: targetAchieved,
    onError: () =>
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Target is on hold",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["active-time"] });
    },
  });

  

  return (
    <div className="flex items-center justify-center gap-4 flex-col w-fit mr-10">
      <Button className="w-full h-14 text-2xl p-5" >Upload Proof</Button>
      <Button className="w-full h-14 text-2xl p-5" onClick={()=>mutate()}>On hold</Button>
     
    </div>
  );
};

export default OnholdProof;
