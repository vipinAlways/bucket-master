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

const Home: React.FC = () => {
  const [historyFor, setHistoryFor] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(true);
  const [targetId, setTargetId] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date>(new Date());

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
        description: "Failed to reactivate task.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["track-record"] });
      setHidden(true);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task reactivated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      setHidden(true);
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

  if (isLoading) return <PendingLoader />;

  const selectedRoute = routes.find((route) => route.url === historyFor);
  const selectedTasks = selectedRoute?.taskData || [];

  return (
    <div className="flex h-full p-3 relative">
      <div className="flex flex-col gap-3 p-3 card min-h-full">
        {routes.map((route, index) => (
          <Button
            key={`${route.headline}-${index}`}
            className="w-96 flex flex-col h-52 rounded-lg p-3 text-bggreen bg-textgreen gap-2 hover:scale-105 transition-all ease-linear duration-200 cursor-pointer hover:bg-textgreen"
            onClick={() => setHistoryFor(route.url)}
          >
            <h1 className="text-3xl border-b-2 border-dotted font-bucket w-fit p-0.5 border-bggreen">
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
              className="w-96 flex flex-col h-56 rounded-lg p-3 text-bggreen bg-textgreen gap-2 hover:bg-textgreen "
            >
              <div className="w-full flex justify-between p-0.5">
                <h1 className="text-3xl border-b-2 border-dotted font-bucket w-fit p-0.5 border-bggreen">
                  {task.ItemName}
                </h1>
                <Button
                  className="bg-red-700 text-textgreen hover:bg-red-800"
                  onClick={() => {
                    setTargetId(task.id);
                    setHidden(false);
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
                  <p>{"00000"}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-2xl text-gray-500">No tasks available</p>
        )}
      </div>

      {!hidden && (
        <div className="fixed top-0 left-0 w-full h-full p-3 z-50 flex flex-col items-center justify-center gap-6 bg-green-400/60 font-bucket text-textgreen">
          <h1 className="text-5xl">Yeah! That's the spirit—go get it back</h1>

          <div className="flex items-center gap-4">
            {hidden ? (
              <form
                onSubmit={onReactiveFailedTask}
                className="text-2xl flex flex-col flex-1 items-center gap-10 "
              >
                <div className="flex items-center gap-9 flex-1 ">
                  <label htmlFor="dueDate" className="rounded-md h-full">
                    Set Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => setDueDate(new Date(e.target.value))}
                    className="rounded-md h-full py-1 flex items-center justify-center text-zinc-600"
                  />
                </div>
                <Button type="submit" className="h-full text-xl py-2">
                  LET'S GOOOO
                </Button>
              </form>
            ) : (
              <ActionPerformLoader />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
