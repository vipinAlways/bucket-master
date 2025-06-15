"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { Suspense, useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import {
  activeBucketItem,
  holdOrAchive,
  remainingAmountIncrease,
} from "./actions/bucketList-action/bucketlist-action";
import TimeCountDown from "@/components/TimeCountDown";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import PendingLoader from "@/components/PendingLoader";
import CreateBucketItem from "@/components/CreateBucketItem";
import Failed from "@/components/Failed";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [disable, setDisable] = useState(false);
  const [completed, setCompleted] = useState<boolean>(false);
  const { toast } = useToast();
  const [functionalAmount, setFunctionalAmount] = useState<number>(0);
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState<number>(0);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["item-active"],
    queryFn: activeBucketItem,
    staleTime: 1000 * 60,
    enabled: true,
  });

  useEffect(() => {
    if (data?.remainingAmount !== undefined && data?.budget) {
      const percentage = 100 - (data.remainingAmount / data.budget) * 100;
      setRemainingBalancePercentage(percentage);
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: PostUser,
    onError: () =>
      toast({
        title: "Error",
        description: "Server Error",
        variant: "destructive",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
    },
  });
  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data?.Active) {
      setIsActive(data.Active);
    } else {
      setIsActive(false);
    }
  }, [data]);

  const remainingAmountFu = useMutation({
    mutationFn: remainingAmountIncrease,
    onError: () => {
      toast({
        title: "Error",
        description: "Server Error while increasing remaining amount",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Remaining Amount Increased Successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-failed"] });
    },
  });
  const handleRemainingAmountIncrease = () => {
    remainingAmountFu.mutate({
      remainingAmount: (data?.remainingAmount ?? 0) - functionalAmount,
    });
    setFunctionalAmount(0);
  };

  const handleRemainingAmountDecrease = () => {
    if (data?.remainingAmount !== undefined) {
      remainingAmountFu.mutate({
        remainingAmount: data.remainingAmount + functionalAmount,
      });
      setFunctionalAmount(0);
    }
  };

  useEffect(() => {
    if (data?.remainingAmount !== undefined) {
      setDisable(data.remainingAmount < functionalAmount);
      setCompleted(data.remainingAmount === 0);
    } else {
      setDisable(false);
    }
  }, [data?.remainingAmount, functionalAmount]);

  const holdAcheive = useMutation({
    mutationKey: ["hold-acheive"],
    mutationFn: holdOrAchive,
    onSuccess: () =>
      toast({
        title: "Success",
        description: "Hold or Achieve Successfully",
      }),
  });

  if (isPending) {
    queryClient.invalidateQueries({ queryKey: ["item-active"] });
    queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
    queryClient.invalidateQueries({ queryKey: ["item-failed"] });
    return <PendingLoader />;
  }

  return (
    <Suspense fallback={<p>loading.......</p>}>
      <div className="w-full font-bucket px-9" >
        <div>
          <div className="max-md:hidden  h-20 flex items-center justify-center pt-4">
            <div className="flex items-start justify-center h-full rounded-full selection:select-none">
              <h1 className="text-6xl missed flex items-center gap-4 justify-center text-textwhite  text-center rounded-xl shrink-0">
                {data?.ItemName ? (
                  <>
                    Target Name:<span>{data?.ItemName}</span>
                  </>
                ) : (
                  <span>START A JOURNEY</span>
                )}
              </h1>
            </div>
          </div>
        </div>
        <div className="p-2 flex gap-10 justify-around w-45 relative max-md:flex-col h-96 py-8 items-center ">
          <div className="relative md:w-fit w-full max-md:flex-col flex items-center h-80 justify-start">
            <div className="h-full w-96 flex items-end  ">
              <TimeCountDown />
            </div>
            <div className="h-full flex items-center justify-center ">
              <div className="overflow-hidden rounded-[50px] relative">
                <div
                  style={
                    {
                      "--top-start": `-${
                        remainingBalancePercentage >= 0
                          ? remainingBalancePercentage + 15
                          : 20
                      }%`,
                    } as React.CSSProperties
                  }
                  className={cn(
                    "water h-80 w-80  flex items-center justify-center ",
                    remainingBalancePercentage >= 0 &&
                      "before:animate-wave after:animate-wave after:rounded-[35%] before:rounded-[45%] before:bg-[#ffffffb3] after:bg-[#ffffff4d]"
                  )}
                >
                  <h1
                    className={cn(
                      "text-4xl ",
                      remainingBalancePercentage > 60
                        ? "text-zinc-400"
                        : "text-black"
                    )}
                  >
                    {remainingBalancePercentage !== 0 &&
                      remainingBalancePercentage.toFixed(2).toString() + "%"}
                  </h1>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 w-full flex justify-center">
            {isActive ? (
              completed === true ? (
                <div className="w-full flex justify-start gap-3  ">
                  <Button
                    onClick={() => {
                      setCompleted(false);
                      holdAcheive.mutate({ todo: "hold" });
                    }}
                  >
                    Edit Amount
                  </Button>
                  <Button
                    onClick={() => holdAcheive.mutate({ todo: "achieve" })}
                  >
                    Achieve
                  </Button>
                </div>
              ) : (
                <div className="h-80 w-80  me transition-all  duration-600 ease-linear">
                  <div className="relative  w-full  rounded-xl bg-headLine h-full transition-all duration-400 ease-in-out group  ">
                    <div className="absolute top-0 left-0 group-hover:z-30 w-80 flex opacity-0  text-textgreen items-center justify-center max-h-80 flex-col gap-4 h-full group-hover:opacity-100 transition-all duration-100 ease-out ">
                      <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-bggreen border-none">
                        <span>{data?.budget}</span>
                      </p>
                      <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-bggreen border-none">
                        <span>{data?.remainingAmount}</span>
                      </p>
                      <div className="flex items-center justify-between w-fit gap-2.5">
                        <Button
                          onClick={handleRemainingAmountDecrease}
                          className="bg-red-600 text-2xl p-0.5 w-12 h-9 rounded-2xl hover:bg-red-600"
                        >
                          <ArrowDownNarrowWide />
                        </Button>
                        <input
                          placeholder="Enter the amount"
                          name="amountEnter"
                          type="text"
                          value={functionalAmount}
                          onChange={(e) => {
                            const number =
                              parseInt(
                                e.target.value.replace(/[^\d]/g, ""),
                                10
                              ) || 0;
                            setFunctionalAmount(number);
                          }}
                          className="h-9 rounded-full px-2 w-40 text-xl text-black/70"
                        />

                        <Button
                          onClick={handleRemainingAmountIncrease}
                          className="bg-green-600 text-2xl p-0.5 w-12 h-9 rounded-2xl hover:bg-green-600"
                        >
                          <ArrowUpNarrowWide />
                        </Button>
                      </div>
                      <p className="text-center w-80 text-red-500 h-9">
                        {disable
                          ? "You have entered more than remaining amount"
                          : ""}
                      </p>
                    </div>
                    <div className="absolute top-0 left-0 flex flex-col justify-around p-8 h-full w-80 group-hover:opacity-0 transition-all duration-100 ease-in text-bggreen rounded-xl bg-headLine ">
                      <h1 className="w-full text-6xl text-start">Hover:</h1>
                      <h1 className="w-full text-6xl text-end">To:</h1>
                      <h1 className="w-full text-6xl text-start">Edit:</h1>
                      <h1 className="w-full text-6xl text-end">Bucket:</h1>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <CreateBucketItem />
            )}
          </div>
        </div>

        <div className=" w-fit py-4 text-bggreen  flex-col flex items-start gap-3">
          <h1 className="text-textwhite missed text-5xl flex items-start gap-1.5 p-2 flex-col ">
            You Missed It,
            <span className="text-6xl text-textwhite ">
              But Growth Comes from Challenges!
            </span>
          </h1>

          <div>
            <Failed />
          </div>
        </div>
      </div>
    </Suspense>
  );
}
