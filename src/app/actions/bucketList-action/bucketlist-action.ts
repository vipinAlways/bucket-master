"use server"
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { $Enums } from "@prisma/client";

interface TargetProps {
  duedate: Date;
  type: $Enums.typeOfTarget;
  onHold: boolean;
  budget: number;
  remainingAmount: number;
}

export const startTarget = async ({
  duedate,
  type,
  onHold,
  budget,
  remainingAmount,
}: TargetProps) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user?.email) {
    throw new Error("Invalid user data");
  }

  try {
    const dbuser = await db.user.findFirst({
      where: {
        email: user?.email,
      },
    });

    const isAlreadyHaveTarget = await db.bucketLists.findFirst({
      where: {
        userId: dbuser?.id,
        Achieved: false,
        onHold: false,
      },
    });

    if (isAlreadyHaveTarget) {
      throw new Error("Currently the target is on hold");
    }

    const createTarget = await db.bucketLists.create({
      data: {
        userId: dbuser?.id,
        Achieved: false,
        onHold: onHold,
        type: type,
        PhotoOfTarget: "",
        duedate: duedate,
        budget: budget,
        remainingAmount: remainingAmount,
      },
    });

    return createTarget;
  } catch (error) {
    console.log("error while creating target", error);
    throw new Error("error while creating target");
  }
};
