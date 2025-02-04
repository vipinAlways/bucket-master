"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import {
  activeBucketItem,
  getFailedToAcheive,
  remainingAmountIncrease,
} from "./actions/bucketList-action/bucketlist-action";
import TimeCountDown from "@/components/TimeCountDown";
import Loader from "@/components/Loader";
import { Minus, Plus } from "lucide-react";
import PendingLoader from "@/components/PendingLoader";
import OnholdProof from "@/components/OnholdProof";
import CreateBucketItem from "@/components/CreateBucketItem";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [dissable, setDissable] = useState(false);
  const [completed, setCompelted] = useState<boolean>(false);
  const { toast } = useToast();

  const [functionalamount, setFunctionalAmount] = useState<number>(0);

  const [fillHeight, setFIllHieght] = useState<number>(0);
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

  console.log(failed.data, "ye hain ");

  if (isPending) {
    return <PendingLoader />;
  }

  return (
    <div>
      <div className="p-2 flex max-md:gap-10 justify-around relative max-md:flex-col items-center">
        <div className="relative md:w-fit w-full max-md:flex-col flex items-center justify-end md:gap-10">
          <div className="max-md:hidden  h-full">
            <div className="flex items-start justify-center w-36 h-96 rounded-full px-5 py-1 selection:select-none">
              <h1 className="text-6xl flex items-center justify-center text-textwhite font-master text-center rounded-xl shrink-0">
                {data?.ItemName}
              </h1>
            </div>
            <div className="min-h-12 w-96 absolute top-[60%] -translate-y-1/4  left-[45%] -translate-x-[70%] px-10 py-0.5">
              <TimeCountDown />
            </div>
          </div>
          <div className="bucket ">
            <div className="water h-80 w-80"></div>
          </div>
          <div className="block w-full md:hidden h-20">
            <TimeCountDown />
          </div>
        </div>
        <div className="md:w-1/2 w-full flex justify-center">
          {isActive ? (
            completed === true ? (
              <div className="w-full flex justify-start ">
                <OnholdProof />
                <Button onClick={() => setCompelted(false)}>Edit Amount</Button>
              </div>
            ) : (
              <div className="h-80 w-80 relative me transition-all  duration-600 ease-linear">
                <div className="absolute  w-full card  rounded-xl bg-[#cfcfcf] h-full transition-all duration-400 ease-in-out  ">
                  <div className="back w-80 flex font-bucket text-textgreen items-center justify-center max-h-80 flex-col gap-4 h-full ">
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-textwhite ">
                      <span>{data?.budget}</span>
                    </p>
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-textwhite">
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
                  <div className="front flex flex-col justify-around p-8 h-full font-bucket text-textgreen ">
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

      <div>

        <h1 className="text-textgreen">Recent Failed targets</h1>
        {failed.data?.map((failedTarget, index) => (
          <div key={index}>
            <h1 className="text-white">{failedTarget.ItemName}</h1>
          </div>
        ))}
      </div>
    </div>
  );
}
