"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import ActionPerformLoader from "./ActionPerformLoader";
import { Activity, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFailedToAchieve,
  reActiveTask,
} from "@/app/actions/bucketList-action/bucketlist-action";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import ReactiveTask from "./ReactiveTask";

const Failed = () => {
  const [hidden1, setHidden] = useState(true);
  const [hidden2, setHidden2] = useState(true);
  const [hidden3, setHidden3] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const queryClient = useQueryClient();
  const { toast } = useToast();

  

  const failedTargetRestart = useMutation({
    mutationFn: reActiveTask,
    onError: (error) => {
      
      toast({
        title: "failed",
        description: `${error.message}`,
        variant:"destructive"
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      setHidden(true);
  
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Remaining amount increased successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      setHidden(true);
      setHidden3(true);
      setHidden2(true);
    },
  });

  const failed = useQuery({
    queryKey: ["item-failed"],
    queryFn: getFailedToAchieve,
  });


  const onReactiveFailedTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    failedTargetRestart.mutate({ targetId, duedate: dueDate });
  };



 

  if (failed.isPending) {
    return (
      <div className="w-full flex items-center justify-center">
        <div className="flex items-center w-fit gap-8 px-6 py-3 rounded-lg bg-textgreen">
          <h1 className="font-bucket text-6xl bg-textgreen/40 w-56 h-10"></h1>

          <div className="w-full flex flex-col items-center gap-1.5 font-master">
            <h1 className="text-3xl bg-textgreen/40 w-8 h-9"></h1>
            <h1 className="text-3xl bg-textgreen/40 w-8 h-9"></h1>

            <Button className="p-2 text-2xl bg-green-600 hover:bg-green-400">
              Reactive <Activity />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      {failed.data?.length ? (
        <div className="flex items-center w-[30rem] gap-8 px-6 py-3 rounded-lg bg-textgreen">
          <h1 className={cn("font-bucket w-1/3",failed.data[failed.data.length-1]?.ItemName.split(" ").length <2 ?"text-5xl":"text-4xl")}>
            {failed.data[failed.data.length-1]?.ItemName || "No Item Name"}
          </h1>

          <div className="w-full flex flex-col items-center gap-1.5 font-master">
            <h1 className="text-3xl">Amount: {failed.data[failed.data.length-1].budget}</h1>
            <h1 className="text-3xl">
              Remaining: {failed.data[failed.data.length-1].remainingAmount}
            </h1>

            <Button
              className="p-2 text-2xl bg-green-600"
              onClick={() => {
                setTargetId(failed.data[failed.data.length-1].id);
                setHidden(false);
              }}
            >
              Reactive <Activity />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center w-fit gap-8 px-6 py-3 rounded-lg h-40 bg-textgreen">
          <h1 className="font-bucket text-6xl">
            Currently You don't Failed Great
          </h1>
        </div>
      )}

      {!hidden1 && (
        <div className="fixed top-0 left-0 w-full h-full p-3 z-50 flex flex-col items-center justify-center gap-6 bg-green-400/60 font-bucket text-textgreen">
          <h1 className="text-5xl">Yeah! That's the spirit—go get it back</h1>

          <div className="flex items-center gap-4">
            {hidden3 ? (
              hidden2 ? (
                <>
                  <Button
                    className="text-3xl p-8 bg-bggreen text-headLine"
                    onClick={() => {
                      setHidden3(false);
                      setTimeout(() => {
                        setHidden3(true);
                        setHidden2(false);
                      }, 1500);
                    }}
                  >
                    YEAH! LET'S GO!
                  </Button>
                  <Button className="text-3xl p-8 bg-red-600 hover:bg-red-800">
                    NOT FEELING IT
                  </Button>
                </>
              ) : (
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
                  <Button className="h-full text-xl py-2">
                    LET'S GOOOO
                  </Button>
                </form>
              )
            ) : (
              <ActionPerformLoader />
            )}
          </div>
        </div>
        // <ReactiveTask targetId={targetId}/>
      )}
    </div>
  );
};

export default Failed;
