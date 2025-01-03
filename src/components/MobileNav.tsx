"use client";
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
import Image from "next/image";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";
import { Home, Inbox, Navigation, Settings, Sidebar } from "lucide-react";
import Link from "next/link";
import { items } from "@/app/constants/constant";

const MobileNavigation = ({ className }: { className: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className={cn("sm:hidden")}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Sidebar className="mx-2 my-1.5 fixed " />
        </SheetTrigger>
        <SheetContent
          className="shad-sheet h-screen px-3 w-60"
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
                <Link href={"/setting"} className="flex h-10 gap-2 text-xl">
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
    </header>
  );
};

export default MobileNavigation;
