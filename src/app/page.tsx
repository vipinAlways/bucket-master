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

const Page = () => {
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);
  const [skill, setSkill] = useState<string>("");
  const [debounceSkill, setDebounceSkill] = useState<string>("");
  const [skillArray, setSkillsArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Debounce user input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceSkill(skill);
    }, 400);
    return () => clearTimeout(timeout);
  }, [skill]);

  // Fetch skill data
  useEffect(() => {
    const controller = new AbortController();

    async function getData() {
      if (!debounceSkill) return;
      console.log('debounceSkill', debounceSkill)

      setLoading(true);
      try {
        const res = await fetch(
          `https://api.apilayer.com/skills?q=${debounceSkill}`,
          {
            method: "GET",
            redirect: "follow",
            headers: {
              apikey: "qL72hoA1Upx9OX1p8uKBCrYHvLhZhRoL",
            },
            signal: controller.signal,
          }
        );

        const data = await res.json();
        console.log("API response:", data);
        setSkillsArray(data ?? []);
        setLoading(false) /// Adjust based on actual API response
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Fetch aborted");
        } else {
          console.error("Error fetching skill data:", error);
        }
      }
    }

    getData();

    return () => controller.abort();
  }, [debounceSkill]);

  console.log(skillArray);

  return (
    <div>
      <section className="flex items-center justify-around w-full gap-4">
        {/* Water Effect Circle */}
        <div className="relative md:w-fit w-full max-md:flex-col flex items-center lg:h-80 justify-end border flex-1">
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
                  "water h-80 w-80 flex items-center justify-center",
                  remainingBalancePercentage >= 0 &&
                    "before:animate-wave after:animate-wave after:rounded-[35%] before:rounded-[45%] before:bg-[#ffffffb3] after:bg-[#ffffff4d]"
                )}
              >
                <h1
                  className={cn(
                    "text-4xl",
                    remainingBalancePercentage > 60
                      ? "text-zinc-400"
                      : "text-textBlack"
                  )}
                >
                  {remainingBalancePercentage !== 0 &&
                    remainingBalancePercentage.toFixed(2) + "%"}
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Dialog */}
        <div className="flex-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-center text-4xl p-3 h-20 text-[#f5edeb] w-72 md:hover-btn"
              >
                Road Map
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md font-bucket h-full">
              <DialogHeader>
                <DialogTitle>{skill} Roadmap</DialogTitle>
                <DialogDescription>
                  Roadmap details for selected skill.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full h-full overflow-y-auto">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit...
                </p>
              </div>
            </DialogContent>
          </Dialog>

          {/* Input Dialog */}
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button variant="outline">Open Dialog</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Get your RoadMap</DialogTitle>
                  <DialogDescription>
                    Select options according to your needs.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="skill">Skill</Label>
                    <Input
                      id="skill"
                      name="skill"
                      value={skill}
                      onChange={(e) => setSkill(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="duration">Within (days)</Label>
                    <Input id="duration" name="duration" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="hours">Hours per day</Label>
                    <Input id="hours" name="hours" />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="future">Future Plan</Label>
                    <Input id="future" name="future" />
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

        {/* Skill Results Display */}
        <div className="flex flex-col gap-2 p-4">
          {loading && <p className="text-muted">Loading...</p>}
          {skillArray ? (
            skillArray.map((skillItem:string,index:number) => (
              <p key={index} className="text-bgCard">
                {skillItem}
              </p>
            ))
          ) : (
            !loading && debounceSkill && (
              <p className="text-red-400">No skills found for "{debounceSkill}"</p>
            )
          )}
        </div>
      </section>
    </div>
  );
};

export default Page;
