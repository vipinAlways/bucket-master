"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Roadmap from "@/components/Roadmap";

const Page = () => {


  return (
    <div className="">
        <div className="h-full flex text-muted justify-evenly p-3 gap-4">

          <div className=" flex-1 h-full  ">

          </div>
          <div className=" flex-1 h-full flex items-center w-full justify-center ">
            <Roadmap/>  
          </div>
        </div>  
    </div>
  );
};

export default Page;
