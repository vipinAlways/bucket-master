"use client"
import { activeBucketItem } from "@/app/actions/bucketList-action/bucketlist-action";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";

const Loader = () => {
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);

  const { data } = useQuery({
    queryKey: ["item-active"],
    queryFn: async () => activeBucketItem(),
  });

  useEffect(() => {
    if (data?.budget) {
      setRemainingBalancePercentage(
        100 - (data.remainingAmount / data.budget) * 100
      );
    }
  }, [data]);

  return (
    <div className="h-7 p-0.5 w-96 rounded-full relative">
      <Progress
        value={remainingBalancePercentage}
        className={`w-[${remainingBalancePercentage}] bgnew h-full`}
      />
    </div>
  );
};

export default Loader;
