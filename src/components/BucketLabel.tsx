import { items } from "@/app/constants/constant";
import Link from "next/link";
import React from "react";

const BucketLabel = () => {
  return (
    <div className="group">
      <div className="h-16 group-hover:h-28 group-hover:scale-95 transition-all duration-200 ease-linear p-3 group-hover:rounded-lg group-hover:backdrop-blur-xl group-hover:bg-white/10 flex items-center justify-between">
        <div>logo</div>

        <ul className="flex min-w-40 items-center gap-4 text-lg sm:text-xl md:text-2xl ">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.url}
                className="flex items-center gap-1 hover:text-zinc-300   transition-all duration-300 "
              >
                <item.icon className="group-hover:opacity-100 sm:opacity-0 " />{" "}
                <span
                  className="r
             "
                >
                  {item.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BucketLabel;
