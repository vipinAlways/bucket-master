"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
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

const page = () => {
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);

  async function getData() {
    const res = await fetch(
      "https://raw.githubusercontent.com/dariusk/corpora/master/data/humans/skills.json"
    );
    const data = await res.json();
    console.log(data.skills); // Array of skill names
  }
  getData();
  return (
    <div>
      <section>
        <div className="relative md:w-fit w-full max-md:flex-col flex items-center lg:h-80  justify-start border">
          <div className="h-full flex items-center justify-center">
            <div className="overflow-hidden rounded-[50px] relative">
              <div
                style={
                  {
                    "--top-start": `-${
                      remainingBalancePercentage >= 0
                        ? remainingBalancePercentage + 15
                        : 20
                    }%`,
                  } as React.CSSProperties
                }
                className={cn(
                  "water h-80 w-80  flex items-center justify-center",
                  remainingBalancePercentage >= 0 &&
                    "before:animate-wave after:animate-wave after:rounded-[35%] before:rounded-[45%] before:bg-[#ffffffb3] after:bg-[#ffffff4d]"
                )}
              >
                <h1
                  className={cn(
                    "text-4xl ",
                    remainingBalancePercentage > 60
                      ? "text-zinc-400"
                      : "text-textBlack"
                  )}
                >
                  {remainingBalancePercentage !== 0 &&
                    remainingBalancePercentage.toFixed(2).toString() + "%"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Get your RoadMap</DialogTitle>
                  <DialogDescription>
                    Select option according to your need. You can always change
                    it later.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="name-1">Skill</Label>
                    <Input
                      id="name-1"
                      name="name"
                      defaultValue="Pedro Duarte"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">With In</Label>
                    <Input
                      id="username-1"
                      name="username"
                      defaultValue="@peduarte"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">Hours per dat</Label>
                    <Input
                      id="username-1"
                      name="username"
                      defaultValue="@peduarte"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="username-1">future Plan </Label>
                    <Input
                      id="username-1"
                      name="username"
                      defaultValue="@peduarte"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
      </section>
    </div>
  );
};

export default page;
