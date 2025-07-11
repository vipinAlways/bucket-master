"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo } from "react";
import {
  reActiveTask,
  trackRecord,
} from "../actions/bucketList-action/bucketlist-action";
import PendingLoader from "@/components/PendingLoader";
import { Button } from "@/components/ui/button";
import ActionPerformLoader from "@/components/ActionPerformLoader";
import { useToast } from "@/hooks/use-toast";
import { ViewState } from "@/components/Failed";

const Home: React.FC = () => {
  const [historyFor, setHistoryFor] = useState<string>("");

  const [targetId, setTargetId] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [viewState, setViewState] = useState<ViewState>("idle");
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["track-record"],
    queryFn: trackRecord,
  });
  const { toast } = useToast();

  const failedTargetRestart = useMutation({
    mutationFn: reActiveTask,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reactivate task.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["track-record"] });

      setViewState("idle");
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task reactivated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });

      setViewState("idle");
    },
  });

  const routes = useMemo(
    () => [
      {
        url: "holdData",
        count: data?.holdCount || 0,
        headline: "Pending Tasks",
        point: "Point Holding",
        taskData: data?.holdTarget || [],
      },
      {
        url: "AcheiveData",
        count: data?.achiveCount || 0,
        headline: "Achieved Tasks",
        point: "Points Achieved",
        taskData: data?.achievedTarget || [],
      },
      {
        url: "failData",
        count: data?.failedCount || 0,
        headline: "Failed Tasks",
        point: "Point Holding",
        taskData: data?.failedTarget || [],
      },
    ],
    [data]
  );

  const onReactiveFailedTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    failedTargetRestart.mutate({ targetId, duedate: dueDate });
  };
  console.log(targetId, "ye hani ");
  if (isLoading) return <PendingLoader />;

  const selectedRoute = routes.find((route) => route.url === historyFor);
  const selectedTasks = selectedRoute?.taskData || [];

  return (
    <div className="flex h-[calc(100vh-8rem)] p-3 relative">
      <div className="flex flex-col gap-3 p-3 card min-h-full">
        {routes.map((route, index) => (
          <Button
            key={`${route.headline}-${index}`}
            className="details flex-col   w-96 h-48 "
            onClick={() => setHistoryFor(route.url)}
          >
            <h1 className="text-3xl border-b-2 border-dotted font-bucket w-fit p-0.5 border-bg">
              {route.headline}
            </h1>
            <div className="flex flex-col gap-1 items-start justify-center">
              <p className="text-2xl">
                Total Tasks: <span>{route.count}</span>
              </p>
              <p className="text-2xl">
                {route.point}: <span>0</span>
              </p>
            </div>
          </Button>
        ))}
      </div>

      <div className="max-h-screen overflow-y-auto overflow-x-hidden w-full p-3 gap-3 flex flex-col items-center sticky top-10">
        {selectedTasks.length > 0 ? (
          selectedTasks.map((task, index) => (
            <div
              key={task.id || index}
              className="w-96 flex flex-col h-56 rounded-lg p-3   gap-2 bg-[#d6e285f3] text-black"
            >
              <div className="w-full flex justify-between p-0.5">
                <h1 className="text-3xl border-b-2 border-dotted font-bucket w-fit p-0.5 border-bg">
                  {task.ItemName}
                </h1>
                <Button
                  className="bg-red-700 text-textgreen hover:bg-red-800"
                  onClick={() => {
                    setTargetId(task.id);
                    setViewState("motivated");
                  }}
                >
                  Reactivate
                </Button>
              </div>

              <div className="flex items-center gap-3 text-2xl">
                <div className="flex flex-col items-start gap-1.5">
                  <span className="w-24 flex justify-between">
                    Dated <span>:</span>
                  </span>
                  <span className="w-24 flex justify-between">
                    Amount <span>:</span>
                  </span>
                  <span className="w-24 flex justify-between">
                    Left <span>:</span>
                  </span>
                  <span className="w-24 flex justify-between">
                    Points <span>:</span>
                  </span>
                </div>
                <div className="flex flex-col items-start gap-1.5 font-master">
                  <p>
                    {task.duedate
                      ? new Date(task.duedate).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>{task.budget || "0"}</p>
                  <p>{task.remainingAmount || "0"}</p>
                  <p>{0}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-500">No tasks available</p>
        )}
      </div>

      {viewState !== "idle" && (
        <div className="fixed top-0 left-0 w-full h-full p-3 z-50 flex flex-col items-center justify-center gap-6 bg-green-400/60 font-bucket text-textBlack">
          {viewState === "motivated" && (
            <>
              <h1 className="text-5xl">
                Yeah! That’s the spirit—go get it back
              </h1>
              <div className="flex items-center gap-4">
                <Button
                  className="text-3xl p-8 text-textBlack md:hover-btn"
                  onClick={() => {
                    setViewState("loading");
                    setTimeout(() => setViewState("form"), 1500);
                  }}
                >
                  YEAH! LET&#39;S GO!
                </Button>
                <Button
                  className="text-3xl p-8 bg-red-600 hover:bg-red-700 md:hover-btn hover:text-textgreen"
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

export default Home;
