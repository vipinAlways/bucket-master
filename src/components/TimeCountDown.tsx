"use client";
import {
  activeBucketItem,
  failedTOAcheive,
} from "@/app/actions/bucketList-action/bucketlist-action";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TimeCountDown = () => {
  const [time, setTime] = useState<Date | null>(null);
  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["item-time-active"],
    queryFn: activeBucketItem,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: failedTOAcheive,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-time-active"] });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
    },
  });

  useEffect(() => {
    if (data?.duedate) {
      setTime(new Date(data.duedate));
    }
  }, [data]);

  useEffect(() => {
    if (!time) return;

    const updateRemainingTime = () => {
      const now = new Date();
      const diff = time.getTime() - now.getTime();

      if (diff <= 0 || data?.onHold) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isPending) mutate(); // Trigger mutation when time is up
        return;
      }

      setRemainingTime({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    updateRemainingTime(); // Run immediately
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [time, data?.onHold]);

  return (
    <div
      className={`flex flex-col w-full text-4xl items-center text-center font-mono ${
        !data?.Active && "hidden"
      }`}
    >
      <div className={cn("flex items-center justify-around max-md:gap-2 w-80 text-7xl",remainingTime.days <1 ?"text-green-700":"text-red-600")}>
        <p>{remainingTime.days}</p>
        <p>{remainingTime.hours}</p>
        <p>{remainingTime.minutes}</p>
        <p>{remainingTime.seconds}</p>
      </div>
    </div>
  );
};

export default TimeCountDown;
