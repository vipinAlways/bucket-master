"use client";
import React, { useState } from "react";
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
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Apple, Dessert, Home, Inbox, Settings } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const AppsideBar = () => {
  const [open, setOpen] = useState(false);
  const items = [
    {
      title: "Home",
      url: "#",
      icon: Home,
    },
    {
      title: "Inbox",
      url: "#",
      icon: Inbox,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
  ];

  

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      className="w-40 "
    >
      <Sidebar collapsible="icon" variant="floating" className="group">
        <SidebarContent>
          <SidebarGroup>
            <SidebarHeader className="w-full  ">
              <SidebarMenuAction className="peer-data-[active=true]/menu-button:opacity-100" />
              <SidebarMenuButton className="w-full flex items-center justify-center h-20">
               <Link href={"/"} className="w-full flex items-center group-data-[collapsoble=icon]:p-1 h-20 justify-start gap-4">
               <span>
                  <Apple />
                </span>

                <p className="group-data-[collapsible=icon]:hidden text-xl flex flex-col items-center" >
                  <span>
                    Application 
                  </span>
                  <span className="text-zinc-600">hello</span>
                </p>
               </Link>
              </SidebarMenuButton>
            </SidebarHeader>

            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarGroupLabel>hello</SidebarGroupLabel>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.url}
                        passHref
                        className="flex items-center space-x-2"
                      >
                        <span>
                          <item.icon className="w-5 h-5" />
                        </span>
                        <span className="group-data-[collapsible=icon]:hidden">
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
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppsideBar;
