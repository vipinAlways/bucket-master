import React, { useState } from 'react'
import { Button } from './ui/button';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reActiveTask } from '@/app/actions/bucketList-action/bucketlist-action';
import { useToast } from '@/hooks/use-toast';
import ActionPerformLoader from './ActionPerformLoader';

const ReactiveTask = ({targetId}:{targetId:string}) => {
    const [hidden2,setHidden2] = useState(false)
    const [hidden3,setHidden3] = useState(false)
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
          
      
        },
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Remaining amount increased successfully",
          });
          queryClient.invalidateQueries({ queryKey: ["item-active"] });
          queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
          queryClient.invalidateQueries({ queryKey: ["item-failed"] });
         
          setHidden3(true);
          setHidden2(true);
        },
      });

      
        const onReactiveFailedTask = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          failedTargetRestart.mutate({ targetId, duedate: dueDate });
        };
  return (
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
            <Button type="submit" className="h-full text-xl py-2">
              LET'S GOOOO
            </Button>
          </form>
        )
      ) : (
        <ActionPerformLoader />
      )}
    </div>
  </div>
  )
}

export default ReactiveTask