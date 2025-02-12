"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { trackRecord } from "../actions/bucketList-action/bucketlist-action";
import Link from "next/link";

const page = () => {
  const { data, isPending } = useQuery({
    queryKey: ["track-record"],
    queryFn: trackRecord,
  });
  console.log(data);

  const routes = [
    {
      url: "holdData",
      count: data?.holdCount,
      headline: "Pending Tasks",
    },
    {
      url: "AcheiveData",
      count: data?.achiveCount,
      headline: "Acheived Tasks",
    },
    {
      url: "failData",
      count: data?.failedCount,
      headline: "Acheived Tasks",
    },
  ];
  return (
    <div className="flex flex-wrap items-center gap-5">
      {routes.map((route, index) => (
        <Link href={`/track/${route.url}`} key={route.headline + index.toString()}>
          <h1>{route.headline}</h1>
        </Link>
      ))}
    </div>
  );
};

export default page;
