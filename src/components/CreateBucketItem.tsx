import { startTarget } from "@/app/actions/bucketList-action/bucketlist-action";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import Link from "next/link";

const CreateBucketItem = () => {
  const [target, setTarget] = useState<TargetProps>({
    duedate: new Date(),
    type: "ShortMilestone",
    budget: 0,
    itemName: "",
  });

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
    <div className="w-full flex items-center justify-start max-h-80 flex-col gap-6 ">
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="text-center text-4xl p-3 h-20  text-[#f5edeb] w-72 md:hover-btn"
          >
            Add to Bucket
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md font-bucket">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Target Name"
              className="w-full h-14 p-2 rounded-lg border border-black"
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
              className="w-full h-14 p-2 rounded-lg border border-black"
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
              className="w-full h-14 p-2 rounded-lg border border-black"
              value={
                target?.duedate
                  ? target.duedate.toISOString().split("T")[0]
                  : ""
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
              className="w-full h-14 p-2 rounded-lg border border-black"
            >
              <option value="ShortMilestone">Short Milestone</option>
              <option value="dreamMilestone">Dream Milestone</option>
            </select>

            <DialogFooter className="flex items-center ">
              <Button
                type="submit"
                className="text-center text-xl p-3 flex-1 text-textBlack"
                disabled={pending}
              >
                <span className="text-center flex items-center gap-4">
                  Add Target
                </span>
              </Button>
              <DialogClose className="text-center p-1.5 rounded-md text-xl border flex-1">
                cancel
              </DialogClose>{" "}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Link
        href={"/track"}
        className=" text-4xl flex items-center justify-center  h-20 bg-[#8fbc38]  text-[#f5edeb] w-80 md:hover-btn rounded-md "
      >
        <span className="text-center flex items-center gap-4 ">
          Track Record
          <span className="text-xl">&#128221; &#10024;</span>
        </span>
      </Link>
    </div>
  );
};

export default CreateBucketItem;
