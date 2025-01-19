"use client";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { PostUser } from "./actions/User-action/UserAction";
import { useToast } from "@/hooks/use-toast";
import {
  activeBucketItem,
  remainingAmountIncrease,
} from "./actions/bucketList-action/bucketlist-action";
import TimeCountDown from "@/components/TimeCountDown";
import Loader from "@/components/Loader";
import { Minus, Plus } from "lucide-react";
import PendingLoader from "@/components/PendingLoader";
import OnholdProof from "@/components/OnholdProof";
import CreateBucketItem from "@/components/CreateBucketItem";

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [dissable, setDissable] = useState(false);
  const [completed, setCompelted] = useState<boolean>(false);
  const { toast } = useToast();

  const [functionalamount, setFunctionalAmount] = useState<number>(0);

  const [fillHeight, setFIllHieght] = useState<number>(0);
  const [remainingBalancePercentage, setRemainingBalancePercentage] =
    useState(0);

  const [isHover, setIsHover] = useState(true);

  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: ["item-active"],
    queryFn: activeBucketItem,
  });

  useEffect(() => {
    if (data?.remainingAmount! >= 0 && data?.budget) {
      const percentage = 100 - (data.remainingAmount / data.budget) * 100;
      setRemainingBalancePercentage(percentage);
      setFIllHieght(500 * (percentage / 100));
    }
  }, [data]);
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
    if (data?.Active) {
      setIsActive(data.Active);
    }
  }, [data]);

  const remainingAmountFu = useMutation({
    mutationFn: remainingAmountIncrease,
    onError: () =>
      toast({
        title: "Error",
        description: "ServerError while increasing remaining amount",
        variant: "destructive",
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Remaining Amount Increased Successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["item-active"] });
    },
  });

  const handleRemainingAmountIncrease = () => {
    remainingAmountFu.mutate({
      remainingAmount: data?.remainingAmount! - functionalamount,
    });
    setFunctionalAmount(0);
  };
  const handleRemainingAmountdecrease = () => {
    remainingAmountFu.mutate({
      remainingAmount: data?.remainingAmount! + functionalamount,
    });
    setFunctionalAmount(0);
  };

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    if (data?.remainingAmount !== undefined) {
      if (data.remainingAmount < functionalamount) {
        setDissable(true);
      } else {
        setDissable(false);
      }

      setCompelted(data.remainingAmount === 0);
    } else {
      setDissable(false);
    }
  }, [data?.remainingAmount, functionalamount]);

  if (isPending) {
    return <PendingLoader />;
  }
  
  return (
    <div>
      <div className="p-2 flex max-md:gap-10 justify-between relative max-md:flex-col items-center">
        <div className="relative md:w-1/2 w-full max-md:flex-col flex items-center justify-end md:gap-10">
          <div className="max-md:hidden  h-full">
            <div className="flex items-start justify-center w-36 h-96 rounded-full px-5 py-1 selection:select-none">
              <h1 className="text-6xl flex items-center justify-center text-textwhite font-master text-center rounded-xl shrink-0">
                {data?.ItemName}
              </h1>
            </div>
            <div className="min-h-12 w-96 absolute top-[60%] -translate-y-1/4  left-[45%] -translate-x-[70%] px-10 py-0.5">
              <TimeCountDown />
            </div>
          </div>
          <div className="h-fit w-96 ">
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              width="280.000000pt"
              height="280.000000pt"
              viewBox="0 0 512.000000 512.000000"
              preserveAspectRatio="xMidYMid meet"
              className="relative"
            >
              <g
                transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="#fff"
                stroke="10"
              >
                <path
                  d="m2325 4204 c-471 -28 -831 -74 -1040 -136 -105 -30 -207 -80 -248
-122 -35 -35 -37 -40 -37 -103 0 -62 2 -67 38 -102 20 -20 49 -45 64 -56 22
-16 27 -31 32 -80 l6 -60 -34 -19 c-40 -21 -112 -106 -133 -156 -14 -31 -13
-61 1 -273 13 -173 24 -265 41 -332 39 -153 113 -294 225 -425 54 -63 39 18
120 -661 26 -224 52 -415 58 -425 5 -11 12 -53 14 -94 5 -88 51 -194 101 -236
70 -59 347 -174 372 -154 5 4 57 -3 115 -16 58 -13 117 -24 132 -24 14 0 28
-4 30 -9 2 -4 14 -11 28 -15 19 -6 21 -5 10 3 -12 9 -11 11 8 11 13 0 21 -4
18 -9 -4 -5 136 -9 341 -10 219 0 342 3 333 9 -11 7 -3 10 28 12 84 3 99 5
111 12 6 4 11 3 11 -1 0 -18 247 13 430 53 160 35 222 56 242 79 15 17 19 18
28 5 8 -12 10 -9 10 13 0 15 -1 28 -2 30 -2 1 5 13 15 27 9 13 17 34 17 46 0
32 -106 124 -128 110 -17 -10 8 245 127 1289 16 143 35 314 42 380 l12 120 71
75 c42 44 86 104 108 145 39 76 108 275 108 313 0 48 -33 86 -85 96 -16 4 -44
21 -62 38 -27 26 -33 40 -33 75 0 33 5 45 21 54 52 27 107 90 114 128 21 123
-65 196 -314 270 -114 34 -408 85 -581 101 -269 24 -679 35 -885 24z m590 -29
c275 -11 638 -58 813 -105 166 -46 303 -112 337 -164 87 -133 -233 -272 -780
-340 -267 -33 -407 -41 -740 -40 -683 1 -1253 94 -1451 236 -75 53 -85 117
-29 167 93 82 304 147 615 191 199 28 450 51 660 60 180 7 262 6 575 -5z
m-1440 -610 c301 -67 664 -100 1115 -99 557 1 1004 57 1275 159 37 14 69 24
70 23 6 -8 -23 -226 -33 -244 -45 -85 -338 -187 -667 -233 -714 -100 -1531
-43 -1890 133 -129 64 -144 82 -161 202 -7 55 -14 111 -14 126 l0 26 93 -33
c50 -18 146 -45 212 -60z m2534 -38 c12 -15 5 -27 -16 -27 -7 0 -13 9 -13 20
0 23 13 26 29 7z m-2874 -45 c-5 -9 -8 -25 -9 -36 -1 -12 -13 -22 -36 -30 -47
-15 -80 -66 -80 -125 0 -74 29 -359 46 -450 25 -136 75 -254 167 -391 28 -41
43 -69 35 -62 -25 20 -112 151 -145 217 -69 137 -96 259 -119 518 -20 239 -17
252 78 343 57 55 82 61 63 16z m2976 -34 c16 -30 7 -29 -19 3 -17 21 -19 27
-7 23 8 -4 20 -15 26 -26z m-17 -30 c19 -27 19 -68 1 -123 l-13 -40 5 61 c4
44 1 69 -11 92 -19 36 -5 43 18 10z m-3027 -88 c-12 -34 -23 -54 -25 -46 -3
15 33 106 42 106 2 0 -5 -27 -17 -60z m2983 19 c0 -59 -76 -211 -141 -280
l-40 -44 5 40 c3 22 8 85 12 140 6 84 11 105 31 130 22 27 30 31 79 31 43 0
54 -4 54 -17z m-2790 -65 c0 -3 25 -204 55 -447 30 -243 61 -507 70 -587 67
-624 99 -850 130 -913 30 -63 30 -63 10 173 -23 262 -88 836 -164 1430 -21
168 -38 306 -37 307 1 1 37 -11 79 -27 256 -100 592 -150 1059 -157 394 -7
685 15 965 73 63 13 246 68 297 89 17 7 18 5 13 -26 -3 -19 -11 -72 -18 -119
-9 -63 -14 -80 -21 -65 -6 16 -7 13 -5 -11 3 -30 1 -32 -39 -38 -24 -3 -118
-24 -211 -47 -192 -47 -237 -48 -283 -4 -16 15 -34 40 -40 56 -7 16 -16 29
-21 29 -13 0 -11 -6 11 -49 24 -48 64 -81 99 -82 14 0 35 -4 46 -9 18 -7 19
-8 3 -15 -31 -12 -171 -1 -205 17 -32 16 -33 16 -33 -6 0 -60 132 -110 187
-71 15 11 53 17 115 19 114 5 202 20 291 51 50 18 67 20 67 11 0 -8 -7 -19
-15 -26 -8 -7 -12 -16 -9 -21 3 -5 -6 -9 -20 -9 -14 0 -28 5 -31 10 -3 6 -14
10 -23 10 -28 -1 39 -50 68 -50 14 0 39 9 56 19 l31 19 -19 -107 c-10 -58 -23
-149 -29 -201 -5 -52 -23 -203 -39 -335 -61 -502 -90 -742 -95 -810 -5 -64 -5
-68 8 -45 14 25 47 248 88 595 12 99 23 191 25 205 22 144 70 551 79 665 3 40
8 52 32 69 15 11 44 33 63 50 l35 31 -30 -35 c-17 -19 -32 -46 -33 -60 -5 -72
-46 -440 -67 -610 -13 -107 -40 -352 -61 -545 -20 -192 -40 -366 -45 -386 -19
-75 -139 -172 -322 -259 -250 -119 -721 -168 -1104 -115 -341 47 -556 124
-685 244 -93 85 -94 89 -139 459 -56 461 -68 569 -84 722 -11 107 -78 672
-111 934 l-6 49 31 -22 c17 -12 31 -25 31 -27z m2593 -56 c-2 -35 -9 -100 -14
-146 -10 -76 -14 -86 -48 -117 -20 -19 -38 -35 -41 -35 -3 0 -11 9 -18 20 -11
18 -10 19 13 10 14 -5 25 -8 25 -6 0 2 5 28 10 57 6 30 17 99 26 153 13 88 22
112 50 126 0 0 -1 -28 -3 -62z m-2679 25 c3 -16 15 -111 26 -213 18 -160 48
-400 66 -535 l5 -40 -23 28 c-65 76 -129 211 -154 325 -20 95 -30 346 -15 399
10 35 17 44 44 52 46 13 45 14 51 -16z m2862 -120 c-8 -15 -15 -25 -16 -21 0
12 23 58 27 54 3 -2 -2 -17 -11 -33z m-86 -136 c0 -2 -12 -14 -27 -28 l-28
-24 24 28 c23 25 31 32 31 24z m-792 -179 l47 0 -31 -15 c-28 -14 -34 -13 -70
6 -21 12 -29 19 -16 15 13 -3 44 -6 70 -6z m-1508 -1767 c101 -53 193 -87 330
-121 213 -54 318 -65 615 -65 272 0 402 12 541 49 47 12 52 12 66 -6 16 -19
17 -19 94 7 157 54 284 137 324 214 12 22 19 29 20 18 1 -63 -74 -141 -198
-205 -297 -154 -822 -208 -1310 -136 -287 42 -549 146 -627 248 -14 19 -28 54
-32 82 l-6 48 54 -47 c30 -26 88 -65 129 -86z"
                />
                <path
                  d="M2350 4093 c-140 -8 -391 -37 -550 -64 -193 -32 -430 -87 -430 -100
0 -5 -6 -6 -13 -3 -18 7 -116 -31 -163 -62 -29 -20 -39 -23 -46 -12 -9 14 -6
39 8 73 8 19 7 19 -16 4 -36 -23 -48 -64 -29 -97 65 -116 369 -203 914 -259
209 -21 851 -24 1040 -5 333 34 544 70 697 118 157 50 258 116 258 169 0 31
-43 81 -91 105 -46 24 -46 24 -46 6 0 -8 6 -12 13 -9 6 2 15 -1 20 -8 5 -8 3
-10 -7 -3 -8 4 5 -10 29 -32 62 -60 55 -94 -26 -137 l-48 -25 -45 20 c-68 30
-274 84 -411 107 -201 34 -416 51 -713 58 -509 11 -995 -43 -1309 -144 -105
-34 -111 -34 -143 -19 -18 9 -33 20 -33 25 0 16 68 70 115 91 130 59 512 135
740 147 60 4 101 9 90 13 -29 10 89 19 345 26 199 6 314 2 625 -21 44 -3 36 0
-30 10 -181 28 -523 41 -745 28z m-1001 -177 c-9 -8 -139 -64 -139 -60 0 6
122 64 134 64 5 0 7 -2 5 -4z m1756 -21 c197 -19 319 -38 455 -70 137 -33 264
-75 253 -85 -4 -4 -42 -19 -83 -33 -231 -80 -849 -145 -1255 -134 -250 7 -506
27 -499 39 3 5 -6 6 -20 2 -32 -8 -292 26 -275 37 7 4 23 3 36 -2 46 -17 53
-12 49 36 -2 26 1 46 8 49 6 2 -25 2 -69 -1 -44 -3 -88 -10 -98 -15 -9 -5 -21
-7 -25 -5 -4 3 -12 -1 -19 -8 -9 -10 -4 -16 25 -28 20 -9 46 -18 57 -21 11 -3
0 -3 -25 -1 -76 9 -189 38 -183 48 3 5 -3 6 -16 2 -13 -4 -21 -2 -21 5 0 6 -8
9 -18 6 -11 -4 -22 2 -30 14 -11 18 -9 22 15 31 16 7 42 12 60 13 17 0 29 4
27 8 -7 10 203 57 352 78 124 17 363 43 499 54 111 9 649 -4 800 -19z"
                  fill="#1b86bd"
                  strokeWidth="10"
                />
                <path d="M1648 3753 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
                <path d="M2440 3700 c18 -12 137 -12 165 0 13 6 -15 9 -80 9 -68 1 -95 -2 -85 -9z" />
                <path d="M1818 3633 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z" />
                <path d="M2278 3633 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z" />
                <path d="M2348 4053 c34 -2 88 -2 120 0 31 2 3 3 -63 3 -66 0 -92 -1 -57 -3z" />
                <path d="M3203 4043 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z" />
                <path d="M3273 4033 c9 -2 23 -2 30 0 6 3 -1 5 -18 5 -16 0 -22 -2 -12 -5z" />
                <path d="M3338 4023 c6 -2 18 -2 25 0 6 3 1 5 -13 5 -14 0 -19 -2 -12 -5z" />
                <path d="M3398 4013 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
                <path d="M3458 4003 c7 -3 16 -2 19 1 4 3 -2 6 -13 5 -11 0 -14 -3 -6 -6z" />
              </g>
            </svg>

            <div className="absolute top-0">hello</div>
          </div>
          <div className="block w-full md:hidden h-20">
            <TimeCountDown />
          </div>
        </div>
        <div className="md:w-1/2 w-full flex justify-center">
          {isActive ? (
            completed === true ? (
              <div className="w-full flex justify-start ">
                <OnholdProof />
                <Button onClick={() => setCompelted(false)}>Edit Amount</Button>
              </div>
            ) : (
              <div className="h-80 w-80 relative me transition-all  duration-600 ease-linear">
                <div className="absolute  w-full card  rounded-xl bg-[#cfcfcf] h-full transition-all duration-400 ease-in-out  ">
                  <div className="back w-80 flex font-bucket text-textgreen items-center justify-center max-h-80 flex-col gap-4 h-full ">
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-textwhite ">
                      <span>{data?.budget}</span>
                    </p>
                    <p className="text-3xl w-40 h-11 flex justify-center items-center rounded-full border bg-textwhite">
                      <span>{data?.remainingAmount}</span>
                    </p>
                    <div className="flex items-center justify-between w-fit gap-2.5">
                      <Button
                        onClick={handleRemainingAmountdecrease}
                        className="bg-red-600 text-2xl p-0.5 w-12 h-9 rounded-2xl hover:bg-red-600"
                      >
                        <Minus className="text-2xl" />
                      </Button>
                      <input
                        placeholder="Enter the amount"
                        name="amountEnter"
                        type="text"
                        value={functionalamount}
                        onChange={(e) => {
                          const number =
                            parseInt(
                              e.target.value.replace(/[^\d]/g, ""),
                              10
                            ) || 0;
                          setFunctionalAmount(number);
                        }}
                        className="h-9 rounded-full px-2 w-40 text-xl "
                      />

                      <Button
                        onClick={handleRemainingAmountIncrease}
                        className="bg-green-600 text-2xl p-0.5 w-12 h-9 rounded-2xl hover:bg-green-600"
                        disabled={dissable}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <p className="text-center w-80 text-red-500 h-9">
                      {dissable
                        ? "You have entered more than remaining amount"
                        : ""}
                    </p>
                  </div>
                  <div className="front flex flex-col justify-around p-8 h-full font-bucket text-textgreen ">
                    <h1 className="w-full text-6xl text-start">Hover:</h1>
                    <h1 className="w-full text-6xl text-end">To:</h1>
                    <h1 className="w-full text-6xl text-start">Edit:</h1>
                    <h1 className="w-full text-6xl text-end">Bucket:</h1>
                  </div>
                </div>
              </div>
            )
          ) : (
            <CreateBucketItem />
          )}
        </div>
      </div>

      <div className="flex w-full items-start  px-10">
      {data?.Active &&   <Loader />}
      </div>
    </div>
  );
}
