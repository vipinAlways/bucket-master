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
    <div className="p-4">
      <ol className="list-decimal group  w-full ">
        {data &&
          data.map((user: User) => (
            <li
              key={user.id}
              className="details w-96 h-52 flex items-start justify-around flex-1"
            >
              <div>
                <h1>{user.userName}</h1>
                <h3>{user.points}</h3>
              </div>
              <div>
                {levels.find((level) => level.points >= user.points)?.name}
              </div>
            </li>
          ))}
      </ol>
    </div>
  );
};

export default page;
