"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import { Cross } from "lucide-react";
import { cn } from "@/lib/utils";
import { startTarget } from "./actions/bucketList-action/bucketlist-action";
import { $Enums } from "@prisma/client";

interface TargetProps {
  duedate: Date;
  type: "ShortMilestone" | "dreamMilestone";
  onHold: boolean;
  budget: number;
  remainingAmount: number;
  itemName: string;
}

export default function Home() {
  const [target, setTarget] = useState<TargetProps>({
    duedate: new Date(),
    type: "ShortMilestone",
    onHold: false,
    budget: 0,
    remainingAmount: 0,
    itemName: "",
  });
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();
  const [hidden, setHidden] = useState("hidden");

  const { mutate } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: PostUser,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError",
        variant: "destructive",
      }),
  });

  const createBucketITem = useMutation({
    mutationKey: ["create-bucket"],
    mutationFn: startTarget,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError while creating bucket",
        variant: "destructive",
      }),
  });

  useEffect(() => {
    mutate();
  }, [mutate]);
  return (
    <div>
      <div className="p-2 flex gap-10 justify-between relative">
        <div className="relative w-1/2 flex items-center justify-end gap-10">
          <div className="relative h-full">
            <div className="h-12 w-36 absolute top-2/3 border -translate-y-1/3 left-1/2 "></div>
          </div>
          <div className="">
            <Image
              src="/images/Bucket-icon.svg"
              alt="bucket"
              width={200}
              height={150}
              className="w-96 h-96"
            />
          </div>
        </div>

        <div className="w-1/2">
          {isActive ? (
            <div></div>
          ) : (
            <div className="w-full flex items-center justify-start h-80">
              <div
                className={cn(
                  "flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#f5edeb] p-4 rounded-lg h-[80%] w-[80%] z-40",
                  hidden
                )}
              >
                {/* <Cross onClick={() => setHidden("hidden")} /> */}
                <form action="">
                  <input
                    type="text"
                    placeholder="Budget Of Target"
                    className="w-full h-12 p-2 border border-[#ff3d13] rounded-lg"
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
                    type="text"
                    placeholder="Target Name"
                    className="w-full h-12 p-2 border border-[#ff3d13] rounded-lg"
                    value={target?.itemName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const targetName = e.target.value || "";
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
                    type="date"
                    placeholder="Due Date"
                    className="w-full h-12 p-2 border border-[#ff3d13] rounded-lg"
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
                    className="w-full h-12 p-2 border border-[#ff3d13] rounded-lg"
                  >
                    <option value="ShortMilestone">Short Milestone</option>
                    <option value="dreamMilestone">Dream Milestone</option>
                  </select>
                  
                  <Button className="text-center text-4xl p-3 h-20 bg-[#ff3d13] hover:bg-[#ff3e13f2] text-[#f5edeb] w-80">
                    <span className="text-center flex items-center gap-4">
                      Add Target
                    </span>
                  </Button>
                </form>
              </div>
              <div className="flex items-center justify-center flex-col gap-6">
                <Button
                  className="text-center text-4xl p-3 h-20 bg-[#ff3d13] hover:bg-[#ff3e13f2] text-[#f5edeb] w-96 hover-btn"
                  onClick={() => setHidden("block")}
                >
                  <span className="text-center flex items-center gap-4">
                    Add to Bucket{" "}
                    <span className="text-xl">&#128221; &#10024;</span>
                  </span>
                </Button>
                <Button className="text-center text-4xl p-3 h-20 bg-[#ff3d13] hover:bg-[#ff3e13f2] text-[#f5edeb] w-80 hover-btn">
                  <span className="text-center flex items-center gap-4  ">
                    Track Record
                    <span className="text-xl">&#128221; &#10024;</span>
                  </span>
                </Button>
              </div>

              <div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
