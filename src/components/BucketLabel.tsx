"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { LogOutIcon, Menu, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { items } from "@/app/constants/constant";
import { usePathname } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import { useQuery } from "@tanstack/react-query";
import { getDbUser } from "@/app/actions/User-action/UserAction";

const BucketLabel = () => {
  const pathName = usePathname();
  const [open, setOpen] = useState(false);

  const { data, isPending } = useQuery({
    queryKey: ["user-data"],
    queryFn: getDbUser,
  });
  useEffect(() => {
    setOpen(false);
  }, [pathName]);
  

  return (
    <div className="flex h-28  justify-center items-center px-2 w-full max-sm:gap-8 bg-bg border-b border-black  z-10 sticky top-0">
      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="absolute top-2 left-3 border-none w-10 text-textBlack hover:text-textBlack"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent
          className="shad-sheet h-screen px-3 w-60 bg-headLine"
          side={"left"}
          aria-describedby="sheet-description"
        >
          <SheetTitle>
            <Link
              href={"/"}
              className="flex h-12 justify-start items-center w-15"
            >
              <Image
                src="/images/Bucket-icon.svg"
                alt="logo"
                width={60}
                height={30}
                className="aspect-square w-16 "
              />

              <SheetDescription className="text-center flex flex-col items-center font-medium  outline-none ring-sidebar-ring ">
                <span className="font-bucket text-3xl">BuCkeT</span>
                <span className="font-master text-sm tracking-[0.8rem] ml-0.5">
                  master
                </span>
              </SheetDescription>
            </Link>
            <Separator className="mb-8 bg-light-200/20" />
          </SheetTitle>

          <div className="h-[calc(100vh-7rem)] flex justify-between flex-col">
            <nav className="">
              <ul className="flex flex-col justify-center gap-2 py-2 px-3">
                {items.map((item) => (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      className="flex items-center gap-2 text-xl"
                    >
                      <span>
                        <item.icon />
                      </span>
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <SheetFooter className="w-full px-3 py-2 flex items-center text-xl">
              <SheetClose asChild>
                <Link
                  href={"/setting"}
                  className="flex h-10 items-center justify-start w-full gap-2 text-xl"
                >
                  <span>
                    <Settings className="text-xl" />
                  </span>

                  <p className="text-xl">
                    <span className="font-bucket text-xl">Settings</span>
                  </p>
                </Link>
              </SheetClose>
              <LogoutLink>
                {" "}
                <LogOutIcon />
              </LogoutLink>
            </SheetFooter>
          </div>
        </SheetContent>
      </Sheet>
      <Image
        src="/images/Bucket-icon.svg"
        alt="logo"
        width={90}
        height={50}
        priority
        className="sm:h-32 sm:w-60 max-sm:w-24 max-sm:h-14 object-contain"
      />

      <p className="text-center flex flex-col font-medium  outline-none ring-sidebar-ring text-sidebar-foreground/80 text-textBlack">
        <span className="font-bucket sm:text-7xl text-2xl  ">BuCkeT</span>
        <span className="font-master sm:text-xl text-sm tracking-[0.75rem] ">
          master
        </span>
      </p>

      <div className="top-2 right-6 absolute flex flex-col items-center gap-2">
        <h4 className="text-2xl  font-bucket  text-textBlack"> Streak</h4>
       <div className="flex items-center gap-2">
       <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C14 5 16 7 16 10C16 13 14 15 12 16C10 15 8 13 8 10C8 7 10 5 12 2Z"
            fill="orange"
          />
          <path
            d="M12 22C15 22 18 19 18 16C18 14 17 13 16 12C16 15 14 17 12 18C10 17 8 15 8 12C7 13 6 14 6 16C6 19 9 22 12 22Z"
            fill="red"
          />
        </svg>
        <span className="text-3xl text-textBlack missed">
          {data && "streak" in data
            ? data.streak
            : isPending && <span>&#8734;</span>}
        </span>
       </div>
      </div>
    </div>
  );
};

export default BucketLabel;
