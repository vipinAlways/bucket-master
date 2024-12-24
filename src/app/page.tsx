"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  const { mutate } = useMutation({
    mutationKey: ["create-user"],
    mutationFn: PostUser,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError",
        variant: "destructive",
      }),
  });

 
  useEffect(() => {
    mutate();
  }, [mutate]);
  return (
    <div>
      <div className="p-2 flex gap-10 justify-between">
        <div className="relative w-1/2 flex items-center justify-end gap-10">
          <div className="relative h-full">
            <div className="h-12 w-36 absolute top-2/3 border -translate-y-1/3 left-1/2 "></div>
          </div>
          <div className="">
            <Image
              src="/images/Bucket-icon.svg"
              alt="bucket"
              width={200}
              height={150}
              className="w-96 h-96"
            />
          </div>
        </div>

        <div className="w-1/2">
          {isActive ? (
            <div></div>
          ) : (
            <div className="w-full flex items-center justify-start h-80">
              <div className="flex items-center justify-center flex-col gap-6">
                <Button className="text-center text-4xl p-3 h-20 bg-[#ff3d13] hover:bg-[#ff3e13f2] text-[#f5edeb] w-96 hover-btn">
                  <span className="text-center flex items-center gap-4">
                    Add to Bucket{" "}
                    <span className="text-xl">&#128221; &#10024;</span>
                  </span>
                </Button>
                <Button className="text-center text-4xl p-3 h-20 bg-[#ff3d13] hover:bg-[#ff3e13f2] text-[#f5edeb] w-80 hover-btn">
                  <span className="text-center flex items-center gap-4  ">
                    Track Record
                    <span className="text-xl">&#128221; &#10024;</span>
                  </span>
                </Button>
              </div>

              <div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
