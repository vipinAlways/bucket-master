import { startTarget } from "@/app/actions/bucketList-action/bucketlist-action";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "./ui/button";

const CreateBucketItem = () => {
  const [target, setTarget] = useState<TargetProps>({
    duedate: new Date(),
    type: "ShortMilestone",
    budget: 0,
    itemName: "",
  });
  const [hidden, setHidden] = useState("hidden");
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const createBucketITem = useMutation({
    mutationKey: ["create-bucket"],
    mutationFn: startTarget,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError while creating bucket",
        variant: "destructive",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bucket Created Successfully",
      });
      setHidden("hidden");
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (createBucketITem.isPending) {
      setPending(true);
    }
    createBucketITem.mutate({
      duedate: target.duedate,
      type: target.type,
      budget: target.budget,
      itemName: target.itemName,
    });
  };
  return (
    <div className="w-full flex items-center justify-start max-h-80">
      <div
        className={cn(
          "my-9 flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5edeb] p-4 rounded-lg h-full max-md:w-full max-md:h-3/5 w-[50%] z-40 px-10 py-9",
          hidden
        )}
      >
        <h1
          className="absolute right-0 top-0 m-1 font-bold text-xl flex items-center justify-center  rounded-full border-2 border-zinc-600 text-orange-500 h-10 w-10 cursor-pointer"
          onClick={() => setHidden("hidden")}
        >
          X
        </h1>

        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Target Name"
            className="w-full h-14 p-2 rounded-lg"
            value={target?.itemName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const targetName = e.target.value.toUpperCase() || "";
              setTarget(
                (prev) =>
                  ({
                    ...prev,
                    itemName: targetName,
                  } as TargetProps)
              );
            }}
          />
          <input
            type="text"
            placeholder="Budget Of Target"
            className="w-full h-14 p-2 rounded-lg"
            value={target?.budget}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const newBudget = parseInt(e.target.value) || 0;
              setTarget(
                (prev) =>
                  ({
                    ...prev,
                    budget: newBudget,
                  } as TargetProps)
              );
            }}
          />
          <input
            type="date"
            placeholder="Due Date"
            className="w-full h-14 p-2 rounded-lg"
            value={
              target?.duedate ? target.duedate.toISOString().split("T")[0] : ""
            }
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const dueDate = new Date(e.target.value);
              setTarget(
                (prev) =>
                  ({
                    ...prev,
                    duedate: dueDate,
                  } as TargetProps)
              );
            }}
          />

          <select
            value={target.type}
            onChange={(e) =>
              setTarget((prev) => ({
                ...prev,
                type: e.target.value as TargetProps["type"],
              }))
            }
            className="w-full h-14 p-2 rounded-lg"
          >
            <option value="ShortMilestone">Short Milestone</option>
            <option value="dreamMilestone">Dream Milestone</option>
          </select>

          <Button
            type="submit"
            className="text-center text-2xl p-3 h-12  text-[#f5edeb] w-40 hover:bg-[#3c237f] bg-[#3c237f]"
            disabled={pending}
          >
            <span className="text-center flex items-center gap-4">
              Add Target
            </span>
          </Button>
        </form>
      </div>
      <div className="flex items-center justify-center flex-col gap-6">
        <Button
          className="text-center text-4xl p-3 h-20  text-[#f5edeb] w-80 md:hover-btn "
          onClick={() => setHidden("")}
        >
          <span className="text-center flex items-center gap-4">
            Add to Bucket <span className="text-xl">&#128221; &#10024;</span>
          </span>
        </Button>
        <Button className="text-center text-4xl p-3 h-20  text-[#f5edeb] w-80 md:hover-btn">
          <span className="text-center flex items-center gap-4  ">
            Track Record
            <span className="text-xl">&#128221; &#10024;</span>
          </span>
        </Button>
      </div>

      <div></div>
    </div>
  );
};

export default CreateBucketItem;
