"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { getAllUser } from "./actions";
import { User } from "@prisma/client";
import { levels } from "@/constant/level.constant";
import Image from "next/image";
import PendingLoader from "@/components/PendingLoader";

const page = () => {
  const [userId, setUserId] = useState<string>("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUser,
  });

  if (isLoading) return <PendingLoader />;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || data.length === 0) return <p>No users found</p>;

  let user: User = data.find((user) => user.id === userId) || data[0];

  return (
    <div className="p-4 flex gap-4 items-start h-[calc(100% - 10rem)] justify-between relative">
      <ol className="group h-full w-1/3 flex flex-col gap-2 items-center p-4 overflow-y-auto ">
        {data &&
          data.map((user: User, index) => (
            <li
              key={user.id}
              className="details w-96 rounded-l flex items-start justify-around  bg-textgreen text-bggreen"
              onClick={() => setUserId(user.id)}
            >
              <div className="flex flex-col items-start justify-center h-full text-bggreen">
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
              <div className="flex flex-col items-center justify-center h-full text-bggreen">
                {levels.find((level) => level.points >= user.points)?.name}
                
              </div>
            </li>
          ))}
      </ol>

      <div className="h-full flex items-center justify-start w-2/3 flex-col gap-10">
        <div className="flex gap-3 items-end">
          {data?.[1] && (
            <div
              className="flex flex-col items-center justify-center gap-2"
              onClick={() => setUserId(data[1].id)}
            >
              <div className="relative h-16 w-16">
                <Image
                  src={data[1]?.Avatar}
                  alt="avatar"
                  layout="fill"
                  className="cover rounded-full"
                />
              </div>
              <div
                className="h-72 w-14 bgne2 rounded-tr-md rounded-tl-md"
                style={{ "--colo": "yellow" } as React.CSSProperties}
              ></div>
            </div>
          )}
          {data?.[0] && (
            <div
              className="flex flex-col items-center justify-center gap-2"
              onClick={() => setUserId(data[0].id)}
            >
              <div className="relative h-16 w-16">
                <Image
                  src={data[0]?.Avatar}
                  alt="avatar"
                  layout="fill"
                  className="cover rounded-full"
                />
              </div>
              <div
                className="h-80 w-14 bgne2 rounded-tr-md rounded-tl-md"
                style={{ "--colo": "red" } as React.CSSProperties}
              ></div>
            </div>
          )}
          {data?.[2] && (
            <div
              className="flex flex-col items-center justify-center gap-2"
              onClick={() => setUserId(data[2].id)}
            >
              <div className="relative h-16 w-16">
                <Image
                  src={data[2]?.Avatar}
                  alt="avatar"
                  layout="fill"
                  className="cover rounded-full"
                />
              </div>
              <div
                className="h-64 w-14 bgne2 rounded-tr-md rounded-tl-md"
                style={{ "--colo": "blue" } as React.CSSProperties}
              ></div>
            </div>
          )}
        </div>

        <div>
          {user && (
            <div className="flex items-center justify-center gap-10 bg-textgreen  p-4 rounded-lg w-96 h-40 text-bggreen ">
              <div className="relative h-24 w-24">
                <Image
                  src={user?.Avatar}
                  alt="avatar"
                  layout="fill"
                  className="cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-2 items-start">
                <h1 className="text-3xl font-bucket">{user?.userName}</h1>
                <h3 className="text-2xl font-bucket">
                  <span>Total Points : </span> {user?.points}
                </h3>
                <h1 className="text-xl font-master">Max Task Points</h1>
                <h1 className="text-2xl font-bucket">
                  {levels.find((level) => level.points >= user.points)?.name}
                </h1>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
