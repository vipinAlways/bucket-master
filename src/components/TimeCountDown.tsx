"use client";
import { activeBucketItem } from "@/app/actions/bucketList-action/bucketlist-action";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TimeCountDown = () => {
  const [time, setTime] = useState<Date | undefined | null>(new Date());

  const [remainingTime, setRemainingTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const { data } = useQuery({
    queryKey: ["item-active"],
    queryFn: async () => activeBucketItem(),
  });

  // Update the `time` state when `data` changes
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
    updateRemainingTime(); // Initial call to set the remaining time immediately.

    return () => clearInterval(interval); // Cleanup interval on unmount.
  }, [time]);

  return (
    <div>
      <p>Days: {remainingTime.days}</p>
      <p>Hours: {remainingTime.hours}</p>
      <p>Minutes: {remainingTime.minutes}</p>
      <p>Seconds: {remainingTime.seconds}</p>
    </div>
  );
};

export default TimeCountDown;
