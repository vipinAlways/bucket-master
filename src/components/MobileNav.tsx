"use client";
import React, { useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { cn } from "@/lib/utils";
import { Home, Inbox, Navigation, Settings, Sidebar } from "lucide-react";
import Link from "next/link";

const MobileNavigation = ({ className }: { className: string }) => {
  const items = [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
  ];
  const { user } = useKindeBrowserClient();
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  return (
    <header className={cn("sm:hidden")}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Sidebar className="mx-2 my-1.5"/>
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3" side={"left"}>
          <SheetTitle>
            <Link
              href={"/"}
              className="flex h-10 justify-start items-center w-15"
            >
              <Image
                src="/images/Bucket-icon.svg"
                alt="logo"
                width={60}
                height={30}
              />

              <p className="group-data-[collapsible=icon]:hidden text-center flex flex-col items-center ">
                <span className="font-bucket text-3xl">BuCkeT</span>
                <span className="font-master text-sm tracking-[0.8rem] ml-0.5">
                  master
                </span>
              </p>
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
                <Link
                  href={"/setting"}
                  className="flex h-10 gap-2 text-xl"
                >
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
