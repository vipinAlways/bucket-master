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

  useEffect(() => {
    if (data?.duedate) {
      setTime(new Date(data.duedate));
    }
    console.log(data, "data");
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
    updateRemainingTime(); 

    return () => clearInterval(interval); 
  }, [time]);

  return (
    <div className="grid grid-cols-1 grid-rows-2 text-black font-bucket font-bold md:text-3xl text-4xl justify-items-center items-center text-center selection:select-text"> 
     
      <div className="grid grid-cols-4 max-md:gap-2 w-56 items-center">
        <p className="text-center w-full">{remainingTime.days}</p>
        <p className="text-center w-full"> {remainingTime.hours}</p>
        <p className="text-center w-full"> {remainingTime.minutes}</p>
        <p className="text-center w-full"> {remainingTime.seconds}</p>
      </div>
      <div className="grid grid-cols-4 ic w-56 md:text-lg text-xl max-md:gap-2 ">
        <p className="text-center ">Days</p>
        <p className="text-center ">Hrs</p>
        <p className="text-center ">Min</p>
        <p className="text-center ">Sec</p>
      </div>
    </div>
  );
};

export default TimeCountDown;
