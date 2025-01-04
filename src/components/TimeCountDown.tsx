"use client";

import { activeBucketItem } from "@/app/actions/bucketList-action/bucketlist-action";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TimeCountDown = () => {
  const [time, setTime] = useState<Date | null>(new Date());
  const [onHold, setOnHold] = useState(false);

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data } = useQuery({
    queryKey: ["active-time"],
    queryFn: async () => activeBucketItem(),
  });

  useEffect(() => {
    if (data) {
      if (data.onHold) {
        setOnHold(true);
        setTime(null);
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else if (data.duedate) {
        setOnHold(false);
        setTime(new Date(data.duedate));
      }
    }
  }, [data]);

  useEffect(() => {
    if (!time || onHold) return;

    const updateRemainingTime = () => {
      const now = new Date();
      const diff = time.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setRemainingTime({ days, hours, minutes, seconds });
    };

    const interval = setInterval(updateRemainingTime, 1000);
    updateRemainingTime();

    return () => clearInterval(interval);
  }, [time, onHold]);

  return (
    <div className="flex flex-col w-full font-bucket md:text-6xl text-4xl items-center text-center selection:select-text text-transparent-border">
      <div
        className={cn(
          "grid grid-cols-4 max-md:gap-2 w-full items-center",
          remainingTime.days === 0 && "text-red-800"
        )}
      >
        <p className="text-center w-full">{remainingTime.days}</p>
        <p className="text-center w-full">{remainingTime.hours}</p>
        <p className="text-center w-full">{remainingTime.minutes}</p>
        <p className="text-center w-full">{remainingTime.seconds}</p>
      </div>
      <div className="grid grid-cols-4 w-full md:text-2xl text-xl max-md:gap-2">
        <p className="text-center">Days</p>
        <p className="text-center">Hrs</p>
        <p className="text-center">Min</p>
        <p className="text-center">Sec</p>
      </div>
    </div>
  );
};

export default TimeCountDown;
