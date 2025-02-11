"use client";
import {
  activeBucketItem,
  failedTOAcheive,
} from "@/app/actions/bucketList-action/bucketlist-action";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, useRef } from "react";

const TimeCountDown = () => {
  const [time, setTime] = useState<Date | null>(null);
  const remainingTimeRef = useRef({
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
        remainingTimeRef.current = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      } else {
        remainingTimeRef.current = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      }
    };

    const interval = setInterval(updateRemainingTime, 1000);
    return () => clearInterval(interval);
  }, [time, data?.onHold, data?.Active]);

  useEffect(() => {
    if (
      remainingTimeRef.current.days === 0 &&
      remainingTimeRef.current.hours === 0 &&
      remainingTimeRef.current.minutes === 0 &&
      remainingTimeRef.current.seconds === 0
    ) {
      if (!isPending) mutate();
    }
  }, [remainingTimeRef.current]);

  return (
    <div
      className={`flex flex-col w-full text-4xl items-center text-center ${
        !data?.Active && "hidden"
      }`}
    >
      <div className="grid grid-cols-4 max-md:gap-2 w-72">
        <p>{remainingTimeRef.current.days}</p>
        <p>{remainingTimeRef.current.hours}</p>
        <p>{remainingTimeRef.current.minutes}</p>
        <p>{remainingTimeRef.current.seconds}</p>
      </div>
    </div>
  );
};

export default TimeCountDown;
