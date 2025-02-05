"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import {
  activeBucketItem,
  getFailedToAcheive,
  reActiveTask,
  remainingAmountIncrease,
} from "./actions/bucketList-action/bucketlist-action";
import TimeCountDown from "@/components/TimeCountDown";
import Loader from "@/components/Loader";
import { Activity, Minus, Plus } from "lucide-react";
import PendingLoader from "@/components/PendingLoader";
import OnholdProof from "@/components/OnholdProof";
import CreateBucketItem from "@/components/CreateBucketItem";
import ActionPerformLoader from "@/components/ActionPerformLoader";
import { cn } from "@/lib/utils";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [dissable, setDissable] = useState(false);
  const [completed, setCompelted] = useState<boolean>(false);
  const { toast } = useToast();

  const [functionalamount, setFunctionalAmount] = useState<number>(0);
  const [hidden1, setHidden] = useState(true);
  const [hidden2, setHidden2] = useState(true);
  const [hidden3, setHidden3] = useState(true);
  const [targetId, setTargetId] = useState("");
  const [fillHeight, setFIllHieght] = useState<number>(0);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["item-active"],
    queryFn: activeBucketItem,
  });
  const failed = useQuery({
    queryKey: ["item-failed"],
    queryFn: getFailedToAcheive,
  });

  useEffect(() => {
    if (data?.remainingAmount! >= 0 && data?.budget) {
      const percentage = 100 - (data.remainingAmount / data.budget) * 100;
      setRemainingBalancePercentage(percentage);
      setFIllHieght(500 * (percentage / 100));
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
    },
  });
  const failedTargetRestart = useMutation({
    mutationFn: reActiveTask,
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

  const onReactiveFailedTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    failedTargetRestart.mutate({ targetId: targetId, duedate: dueDate });
  };

  console.log(failed.data, "ye hain");
  return (
    <div className="w-full">
      <div>
        <div className="max-md:hidden  h-20 flex items-center justify-center pt-4">
          <div className="flex items-start justify-center h-full rounded-full selection:select-none">
            <h1 className="text-6xl missed flex items-center gap-4 justify-center text-textwhite font-bucket text-center rounded-xl shrink-0">
              Target Name:<span>{data?.ItemName}</span>
            </h1>
          </div>
        </div>
      </div>
      <div className="p-2 flex max-md:gap-10 justify-around w-45 relative max-md:flex-col h-96 py-8 items-center">
        <div className="relative md:w-fit w-full max-md:flex-col flex items-center h-80 justify-start md:gap-10">
          <div className="h-full w-full flex items-end  ">
            <TimeCountDown />
          </div>
          <div className="h-full w-full flex items-center justify-center ">
            <div className="bucket ">
              <div className=" water rounded-md  h-80 w-80 before:animate-wave after:animate-wave after:rounded-[35%] before:rounded-[45%]  before:bg-[#ffffffb3] after:bg-[#ffffff4d]"></div>
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
                  <div className="back w-80 flex font-bucket text-textgreen items-center justify-center max-h-80 flex-col gap-4 h-full ">
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
                        className="h-9 rounded-full px-2 w-40 text-xl "
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
                  <div className="front flex flex-col justify-around p-8 h-full font-bucket text-textgreen rounded-md bg-headLine">
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

      <div className="flex w-full items-start  px-10">
        {data?.Active && <Loader />}
      </div>

      <div className=" w-fit py-4 text-bggreen ">
        <h1 className="text-textgreen missed text-5xl flex items-start gap-1.5 p-2 flex-col font-bucket">
          You Missed It,
          <span className="text-6xl text-textgreen ">
            {" "}
            But Growth Comes from Challenges!
          </span>
        </h1>

        <div className="w-full flex items-center justify-center">
          {failed.data?.length ? (
            <div className="flex items-center w-fit gap-8 px-6 py-3 rounded-lg bg-textgreen">
              <h1 className="font-bucket text-6xl">
                {failed.data[0]?.ItemName || "No Item Name"}
              </h1>

              <div className="w-full flex flex-col items-center gap-1.5 font-master">
                <h1 className="text-3xl">Amount: {failed.data[0].budget}</h1>
                <h1 className="text-3xl">
                  Remaining: {failed.data[0].remainingAmount}
                </h1>

                <Button
                  className="p-2 text-2xl bg-green-600"
                  onClick={() => {
                    setTargetId(failed.data[0].id);
                    setHidden(false);
                  }}
                >
                  Reactive <Activity />
                </Button>
              </div>
            </div>
          ) : null}

          {!hidden1 && (
            <div className="fixed top-0 left-0 w-full h-full p-3 z-50 flex flex-col items-center justify-center gap-6 bg-green-400/60 font-bucket">
              <h1 className="text-5xl text-bggreen">
                Yeah! That's the spirit—go get it back
              </h1>

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
                    <form onSubmit={onReactiveFailedTask}>
                      <label htmlFor="dueDate">Set Due Date</label>
                      <input
                        type="date"
                        value={
                          dueDate ? dueDate.toISOString().split("T")[0] : ""
                        }
                        onChange={(e) => setDueDate(new Date(e.target.value))}
                      />
                      <Button type="submit">LET'S GOOOO</Button>
                    </form>
                  )
                ) : (
                  <ActionPerformLoader />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
