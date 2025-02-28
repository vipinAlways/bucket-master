"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllUser } from "./actions";
import { User } from "@prisma/client";
import { levels } from "@/constant/level.constant";

const page = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUser,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || data.length === 0) return <p>No users found</p>;

  return (
    <div className="p-4 flex gap-4 items-start h-full justify-around relative">
      <ol className="group h-full border  w-96 flex flex-col gap-2 overflow-y-auto ">
        {data &&
          data.map((user: User, index) => (
            <li
              key={user.id}
              className="details w-96 rounded-l flex items-start justify-around  bg-[#3c23804d]"
            >
              <div className="flex flex-col items-start justify-center h-full">
                <div>
                  <h1 className="text-3xl font-bucket ">
                    <span>{index + 1}</span> {user.userName}
                  </h1>
                  <h3 className="text-2xl font-bucket ">
                    <span>Total Points : </span> {user.points}
                  </h3>
                </div>

                <h1 className="text-xl font-master">Max Task Points</h1>
              </div>
              <div className="flex flex-col items-center justify-center h-full">
                {levels.find((level) => level.points >= user.points)?.name}
                {/* {user.maxpoints} */}
              </div>
            </li>
          ))}

      
      </ol>

      <div className="flex gap-3 items-end">
        {data?.[1] && (
          <div>
            <h1 className="h-14 w-14 rounded-full border">{data[1].userName}</h1>
            <div className="h-72 w-14 bg-yellow-600"></div>
          </div>
        )}
        {data?.[0] && (
          <div>
            <h1 className="h-14 w-14 rounded-full border">{data[0].userName}</h1>
            <div className="h-80 w-14 bg-red-600"></div>
          </div>
        )}
        {data?.[2] && (
          <div>
            <h1 className="h-14 w-14 rounded-full border">{data[2].userName}</h1>
            <div className="h-64 w-14 bg-green-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
