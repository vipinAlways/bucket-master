"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import {
  activeBucketItem,
  remainingAmountIncrease,
} from "./actions/bucketList-action/bucketlist-action";
import TimeCountDown from "@/components/TimeCountDown";
import Loader from "@/components/Loader";
import { Activity, Minus, Plus } from "lucide-react";
import PendingLoader from "@/components/PendingLoader";
import OnholdProof from "@/components/OnholdProof";
import CreateBucketItem from "@/components/CreateBucketItem";
import ActionPerformLoader from "@/components/ActionPerformLoader";
import Failed from "@/components/Failed";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [dissable, setDissable] = useState(false);
  const [completed, setCompelted] = useState<boolean>(false);
  const { toast } = useToast();
  const [functionalamount, setFunctionalAmount] = useState<number>(0);
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState<number>(0);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["item-active"],
    queryFn: activeBucketItem,
  });

  useEffect(() => {
    if (data?.remainingAmount! >= 0 && data?.budget) {
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
        description: "ServerError",
        variant: "destructive",
      }),
  });

  useEffect(() => {
    if (data?.Active) {
      setIsActive(data.Active);
    }
  }, [data]);

  const remainingAmountFu = useMutation({
    mutationFn: remainingAmountIncrease,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError while increasing remaining amount",
        variant: "destructive",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Remaining Amount Increased Successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
    },
  });

  const handleRemainingAmountIncrease = () => {
    remainingAmountFu.mutate({
      remainingAmount: data?.remainingAmount! - functionalamount,
    });
    setFunctionalAmount(0);
  };
  const handleRemainingAmountdecrease = () => {
    remainingAmountFu.mutate({
      remainingAmount: data?.remainingAmount! + functionalamount,
    });
    setFunctionalAmount(0);
  };

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data?.remainingAmount !== undefined) {
      if (data.remainingAmount < functionalamount) {
        setDissable(true);
      } else {
        setDissable(false);
      }

      setCompelted(data.remainingAmount === 0);
    } else {
      setDissable(false);
    }
  }, [data?.remainingAmount, functionalamount]);

  if (isPending) {
    return <PendingLoader />;
  }

  return (
    <div className="w-full font-bucket">
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
      <div className="p-2 flex max-md:gap-10 justify-around w-45 relative max-md:flex-col h-96 py-8 items-center">
        <div className="relative md:w-fit w-full max-md:flex-col flex items-center h-80 justify-start">
          <div className="h-full w-96 flex items-end  ">
            <TimeCountDown />
          </div>
          <div className="h-full flex items-center justify-center ">
            <div className="bucket relative">
              <div
                style={
                  {
                    "--top-start": `-${
                      remainingBalancePercentage !== 0
                        ? remainingBalancePercentage + 15
                        : 20
                    }%`,
                  } as React.CSSProperties
                }
                className=" water  h-80 w-80 before:animate-wave after:animate-wave after:rounded-[35%] before:rounded-[45%]  before:bg-[#ffffffb3] after:bg-[#ffffff4d]"
              ></div>
              <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl missed">
                {remainingBalancePercentage !== 0 &&
                  remainingBalancePercentage.toFixed(2).toString() + "%"}
              </h1>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 w-full flex justify-center">
          {isActive ? (
            completed === true ? (
              <div className="w-full flex justify-start ">
                <Button onClick={() => setCompelted(false)}>Edit Amount</Button>
              </div>
            ) : (
              <div className="h-80 w-80  me transition-all  duration-600 ease-linear">
                <div className="relative  w-full card  rounded-xl bg-headLine h-full transition-all duration-400 ease-in-out  ">
                  <div className="back w-80 flex  text-textgreen items-center justify-center max-h-80 flex-col gap-4 h-full ">
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-bggreen border-none">
                      <span>{data?.budget}</span>
                    </p>
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-bggreen border-none">
                      <span>{data?.remainingAmount}</span>
                    </p>
                    <div className="flex items-center justify-between w-fit gap-2.5">
                      <Button
                        onClick={handleRemainingAmountdecrease}
                        className="bg-red-600 text-2xl p-0.5 w-12 h-9 rounded-2xl hover:bg-red-600"
                      >
                        <Minus className="text-2xl" />
                      </Button>
                      <input
                        placeholder="Enter the amount"
                        name="amountEnter"
                        type="text"
                        value={functionalamount}
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
                        disabled={dissable}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <p className="text-center w-80 text-red-500 h-9">
                      {dissable
                        ? "You have entered more than remaining amount"
                        : ""}
                    </p>
                  </div>
                  <div className="front flex flex-col justify-around p-8 h-full  text-textgreen rounded-md bg-headLine">
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

      <div className=" w-fit py-4 text-bggreen ">
        <h1 className="text-textgreen missed text-5xl flex items-start gap-1.5 p-2 flex-col ">
          You Missed It,
          <span className="text-6xl text-textgreen ">
            {" "}
            But Growth Comes from Challenges!
          </span>
        </h1>

        <div>
          <Failed />
        </div>
      </div>

      {/* <div className="flex w-full items-start  px-10">
        {data?.Active && <Loader />}
      </div> */}
    </div>
  );
}
