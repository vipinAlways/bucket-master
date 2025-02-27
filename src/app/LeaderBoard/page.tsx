"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllUser } from "./actions";
import { User } from "@prisma/client";
import { levels } from "@/constant/level.constant";

const page = () => {
  const { data } = useQuery({
    queryKey: ["all-users-data"],
    queryFn: getAllUser,
  });

  return (
    <div className="p-4 flex gap-4 items-start">
      <ol className="list-decimal group  w-full  ">
        {data &&
          data.map((user: User) => (
            <li
              key={user.id}
              className="details w-96 h-44 flex items-start justify-around flex-1 bg-[#3c23804d]"
            >
              <div className="flex flex-col items-start justify-center h-full">
                <div>
                  <h1 className="text-3xl font-bucket ">{user.userName}</h1>
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
        <div>
          <h1>{data && data[0].userName}</h1>
          <div className="h-72 w-14 bg-yellow-600"></div>
        </div>
        <div>
          <h1>{data && data[1].userName}</h1>
          <div className="h-80 w-14 bg-red-600"></div>
        </div>{" "}
        <div>
            <h1>{data && data[2].userName}</h1>
            <div className="h-64 w-14 bg-green-600"></div>
        </div>
      </div>
    </div>
  );
};

export default page;
