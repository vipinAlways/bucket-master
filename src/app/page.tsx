"use client"
import { cn } from '@/lib/utils'
import React, { useState } from 'react'

const page = () => {
  const [remainingBalancePercentage, setRemainingBalancePercentage] = useState(0)
  return (
    <div>
      <section>
           <div className="relative md:w-fit w-full max-md:flex-col flex items-center lg:h-80  justify-start">
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
      </section>
    </div>
  )
}

export default page