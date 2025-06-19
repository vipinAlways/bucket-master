"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import ActionPerformLoader from "./ActionPerformLoader";
import { Activity } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFailedToAchieve,
  reActiveTask,
} from "@/app/actions/bucketList-action/bucketlist-action";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

 export type ViewState = "idle" | "motivated" | "form" | "loading";

const Failed = () => {
  const [targetId, setTargetId] = useState("");
  const [dueDate, setDueDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });

  const [viewState, setViewState] = useState<ViewState>("idle");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const failed = useQuery({
    queryKey: ["item-failed"],
    queryFn: getFailedToAchieve,
  });

  const failedTargetRestart = useMutation({
    mutationFn: reActiveTask,
    onError: (error) => {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      setViewState("idle");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Remaining amount increased successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      setViewState("idle");
    },
  });

  const lastFailedItem = failed.data?.[failed.data.length - 1];

  const onReactiveFailedTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    failedTargetRestart.mutate({ targetId, duedate: dueDate });
    setViewState("loading");
  };

  if (failed.isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center w-96 gap-8 px-6 py-3 rounded-lg bg-black/20 backdrop-blur-xl">
          <h1 className="font-bucket text-6xl bg-white/40 w-56 h-10 rounded-lg"></h1>
          <div className="w-full flex flex-col items-center gap-1.5 font-master rounded-lg">
            <h1 className="text-3xl bg-white/40 w-24 rounded-md h-9"></h1>
            <h1 className="text-3xl bg-white/40 w-24 rounded-mg h-9"></h1>
            <Button className="p-2 text-2xl bg-white/40 w-28 h-8"></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      {lastFailedItem ? (
        <div className="flex items-center max-w-md gap-8 p-6 rounded-lg bg-bgCard/60 text-textBlack flex-1">
          <h1
            className={cn(
              "font-bucket w-1/3",
              lastFailedItem.ItemName.split(" ").length < 2
                ? "text-5xl"
                : "text-4xl"
            )}
          >
            {lastFailedItem.ItemName}
          </h1>

          <div className="w-full flex flex-col items-center gap-2 font-master">
            <div className="flex flex-col items-start p-1 gap-1">
              <h1 className="text-3xl">Amount: {lastFailedItem.budget}</h1>
              <h1 className="text-3xl">
                Remaining: {lastFailedItem.remainingAmount}
              </h1>
            </div>

            <Button
              className="p-3 text-2xl hover-btn "
              onClick={() => {
                setTargetId(lastFailedItem.id);
                setViewState("motivated");
              }}
            >
              Reactive <Activity />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-fit gap-8 px-6 py-3 rounded-lg h-40 bg-textgreen text-bg">
          <h1 className="font-bucket text-6xl">
            Currently You Don&#39;t Failed. Great!
          </h1>
        </div>
      )}

      {viewState !== "idle" && (
        <div className="fixed top-0 left-0 w-full h-full p-3 z-50 flex flex-col items-center justify-center gap-6 bg-green-400/60 font-bucket text-textBlack">
          {viewState === "motivated" && (
            <>
              <h1 className="text-5xl">
                Yeah! That’s the spirit—go get it back
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  className="text-3xl p-8 text-textBlack hover-btn"
                  onClick={() => {
                    setViewState("loading");
                    setTimeout(() => setViewState("form"), 1500);
                  }}
                >
                  YEAH! LET&#39;S GO!
                </Button>
                <Button
                  className="text-3xl p-8 bg-red-600 hover:bg-red-700 hover-btn hover:text-textgreen"
                  onClick={() => setViewState("idle")}
                >
                  NOT FEELING IT
                </Button>
              </div>
            </>
          )}

          {viewState === "form" && (
            <form
              onSubmit={onReactiveFailedTask}
              className="text-2xl flex flex-col items-center gap-10"
            >
              <div className="flex items-center gap-9">
                <label htmlFor="dueDate" className="rounded-md">
                  Set Due Date
                </label>
                <input
                  type="date"
                  value={dueDate.toISOString().split("T")[0]}
                  onChange={(e) => setDueDate(new Date(e.target.value))}
                  className="rounded-md py-1 px-2 text-zinc-600"
                />
              </div>
              <Button type="submit" className="text-xl py-2">
                LET&#39;S GOOOO
              </Button>
              <Button
                type="button"
                className="text-xl py-2"
                onClick={() => setViewState("idle")}
              >
                Cancel
              </Button>
            </form>
          )}

          {viewState === "loading" && <ActionPerformLoader />}
        </div>
      )}
    </div>
  );
};

export default Failed;
