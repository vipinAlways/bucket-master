import { activeBucketItem } from "@/app/actions/bucketList-action/bucketlist-action";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const Loader = () => {
  const [remainingBalance, setRemainingBalance] = useState<number>(0);
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);

  const { data } = useQuery({
    queryKey: ["item-active"],
    queryFn: async () => activeBucketItem(),
  });

  useEffect(() => {
    if (data?.remainingAmount) {
      setRemainingBalance(data.remainingAmount);
    }

    if (data?.budget) {
      setRemainingBalancePercentage(
        100 - (data.remainingAmount / data.budget) * 100 
      );
    }
  }, [data]);
  return (
    <div className="h-8 p-0.5 w-96 rounded-full relative">
      
   
      <div
      style={{ width: `${remainingBalancePercentage > 0 ? remainingBalancePercentage : 100}%` }}
        className={cn(
          "h-full  rounded-full absolute top-0 left-0 z-30 ",
          remainingBalance >= 0
            ? `new`
            : ""
        )}
      ></div>
      <div
     
        className={cn(
          "h-full border rounded-full absolute top-0 left-0 w-full",
          remainingBalance > 0
            ? `bgnew`
            : ""
        )}
      ></div>
      </div>
    
  );
};

export default Loader;
