"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider, useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { Home, Inbox, Settings } from "lucide-react";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";


const Provider = ({ children }: { children: React.ReactNode}) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null
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

  
  return (
    <QueryClientProvider client={queryClient}>


      <SidebarProvider
        open={open}
        onOpenChange={setOpen}
        className={cn("w-[100vw]")}
   
      >
        <Sidebar
          collapsible="icon"
          variant="floating"
          className={cn("items-center flex-col md:flex hidden" )}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          color="#F1F1F1"       
        >
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className={cn("h-20", open ? "" : "hidden")}>
                <SidebarMenuButton
                  className="w-full flex items-center h-fit"
                  asChild
                >
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
                </SidebarMenuButton>
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarGroupLabel>hello</SidebarGroupLabel>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title} className="">
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.url}
                          passHref
                          className={cn(
                            "flex",
                            !open && "items-center flex-col"
                          )}
                        >
                          <span>
                            <item.icon className="text-xl" />
                          </span>
                          <span className="group-data-[collapsible=icon]:hidden font-bucket text-xl">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="w-full flex items- justify-start">
          <SidebarMenuButton
                  className="w-full flex items-center h-fit"
                  asChild
                >
            <Link
              href={"/"}
              className="flex h-10 justify-start items-center w-15"
            >
             <span>
             <Settings className="text-xl"/>
             </span>

              <p className="group-data-[collapsible=icon]:hidden text-center flex flex-col items-center ">
                <span className="font-bucket text-xl">Settings</span>
              </p>
            </Link>
            </SidebarMenuButton>
          </SidebarFooter>
        </Sidebar>

        {children}
      </SidebarProvider>
    </QueryClientProvider>
  );
};

export default Provider;
