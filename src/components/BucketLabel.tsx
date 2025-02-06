"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
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
import { Menu, Settings } from "lucide-react";
import { Separator } from "./ui/separator";
import { items } from "@/app/constants/constant";
const BucketLabel = () => {
  const [open, setOpen] = useState(false);
  return (
    <Link
      href={"/"}
      className="flex h-28  justify-center items-center px-2 mx-3 w-full max-sm:gap-8 bg-bggreen border-b rounded-lg border-textgreen  z-10 sticky top-0"
    >
      <Sheet onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="absolute top-2 left-3 border-none w-10 text-textgreen hover:text-textgreen">
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

            <SheetFooter className="px-3 py-2 flex flex-col text-xl">
              <SheetClose asChild>
                <Link href={"/setting"} className="flex h-10 items-center justify-start w-full gap-2 text-xl">
                  <span>
                    <Settings className="text-xl" />
                  </span>

                  <p className="text-xl">
                    <span className="font-bucket text-xl">Settings</span>
                  </p>
                </Link>
              </SheetClose>
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

      <p className="text-center flex flex-col font-medium  outline-none ring-sidebar-ring text-sidebar-foreground/80 text-textgreen">
        <span className="font-bucket sm:text-7xl text-2xl  ">BuCkeT</span>
        <span className="font-master sm:text-xl text-sm tracking-[0.75rem] ">
          master
        </span>
      </p>
    </Link>
  );
};

export default BucketLabel;
