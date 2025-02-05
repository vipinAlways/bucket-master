"use server";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { $Enums } from "@prisma/client";

interface TargetProps {
  duedate: Date;
  type: $Enums.typeOfTarget;
  budget: number;
  itemName: string;
}

const { getUser } = getKindeServerSession();
export const startTarget = async ({
  duedate,
  type,
  budget,
  itemName,
}: TargetProps) => {
  const user = await getUser();
  if (!user?.email) {
    console.log("Invalid user data");
    return;
  }

  try {
    const dbuser = await db.user.findFirst({
      where: {
        email: user?.email,
      },
    });
    if (!dbuser) console.log("no user with this email");

    const isAlreadyHaveTarget = await db.bucketItems.findFirst({
      where: {
        userId: dbuser?.id,
        Active: true,
      },
    });

    if (isAlreadyHaveTarget) {
      console.log(isAlreadyHaveTarget, "ye chahiye");
      return;
    }

    if (duedate <= new Date()) {
      console.log("date should be not be today");
      return;
    }

    const createTarget = await db.bucketItems.create({
      data: {
        userId: dbuser?.id,
        Achieved: false,
        onHold: false,
        type: type,
        PhotoOfTarget: "",
        duedate: duedate,
        budget: budget,
        remainingAmount: budget,
        ItemName: itemName,
        Active: true,
        failed: false,
      },
    });

    return createTarget;
  } catch (error) {
    console.log("error while creating target", error);
    return;
  }
};

export const activeBucketItem = async () => {
  await db.$connect();

  try {
    const user = await getUser();
    if (!user?.email) {
      console.log("Invalid user data");
      return;
    }
    const dbuser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbuser) {
      console.log("no user with this email");
      return;
    }
    return await db.bucketItems.findFirst({
      where: {
        userId: dbuser.id,
        Active: true,
      },
    });
  } catch (error) {
    console.log("error while find bucket item", error);
    console.log("error while bucket item");
  }
};

export const remainingAmountIncrease = async ({
  remainingAmount,
}: {
  remainingAmount: number;
}) => {
  await db.$connect();

  try {
    const user = await getUser();
    if (!user?.email) {
      console.log("Invalid user data");
      return;
    }
    const dbuser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbuser) {
      console.log("no user with this email");
      return;
    }
    const activeBucket = await db.bucketItems.findFirst({
      where: {
        userId: dbuser.id,
        Active: true,
      },
    });

    if (!activeBucket) {
      console.log("no active bucket");
      return;
    }

    return await db.bucketItems.update({
      where: {
        id: activeBucket.id,
      },
      data: {
        remainingAmount: remainingAmount,
      },
    });
  } catch (error) {
    console.log("error while find bucket item", error);
    console.log("error while bucket item");
  }
};

export const targetonHold = async () => {
  await db.$connect();
  try {
    const user = await getUser();
    if (!user?.email) {
      console.log("Invalid user data");
      return;
    }
    const dbuser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbuser) {
      console.log("no user with this email");
      return;
    }
    const activeBucket = await db.bucketItems.findFirst({
      where: {
        userId: dbuser.id,
        Active: true,
        onHold: false,
        failed:false
      },
    });

    if (!activeBucket) {
      console.log("no active bucket");
      return;
    }

    return await db.bucketItems.update({
      where: {
        id: activeBucket.id,
      },
      data: {
        onHold: true,
        Active: false,
        duedate: new Date(),
      },
    });
  } catch (error) {
    console.log("error while holding bucket item server", error);
    console.log("error while bucket item server holding");
  }
};
export const failedTOAcheive = async () => {
  await db.$connect();
  try {
    const user = await getUser();
    if (!user?.email) {
      console.log("Invalid user data");
      return;
    }
    const dbuser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbuser) {
      console.log("no user with this email");
      return;
    }
    const activeBucket = await db.bucketItems.findFirst({
      where: {
        userId: dbuser.id,
        Active: true,
        onHold: false,
        failed: false,
      },
    });

    if (!activeBucket || !activeBucket.budget) {
      console.log("no active bucket");
      return;
    }

    if (activeBucket.duedate && new Date(activeBucket.duedate) < new Date()) {
      return await db.bucketItems.update({
        where: {
          id: activeBucket.id,
        },
        data: {
          failed: true,
          Active: false,
        },
      });
    }
  } catch (error) {
    console.log("error while failed bucket item server", error);
    console.log("error while bucket item server failed");
  }
};
export const getFailedToAcheive = async () => {
  await db.$connect();

  try {
    const user = await getUser();
    if (!user?.email) {
      throw new Error("User is not Authenticated");
    }
    const dbuser = await db.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbuser) {
      console.log("no user with this email");
      throw new Error("User is not regiester");
    }

    return await db.bucketItems.findMany({
      where: {
        userId: dbuser.id,
        failed: true,
        Active: false,
      },
    });
  } catch (error) {
    throw new Error("Server Error");
  }
};

export const reActiveTask = async ({
  targetId,
  duedate,
}: {
  targetId: string;
  duedate?: Date;
}) => {
  await db.$connect();

  try {
    const failedTarget = await db.bucketItems.findFirst({
      where: {
        id: targetId,
        Active: false,
        failed: true,
      },
    });
    const holdTarget = await db.bucketItems.findFirst({
      where: {
        id: targetId,
        Active: false,
        onHold: true,
      },
    });

    if (failedTarget) {
      if (!duedate) {
        throw new Error("Due need to restart the challenge")
      }
      return await db.bucketItems.update({
        where: {
          id: targetId,
        },
        data: {
          Active: true,
          failed: false,
          duedate: duedate,
        },
      });
    }
    if (holdTarget) {
      if (duedate) {
        return await db.bucketItems.update({
          where: {
            id: targetId,
          },
          data: {
            Active: true,
            onHold: false,
            duedate:duedate
          },
        });
      }
      return await db.bucketItems.update({
        where: {
          id: targetId,
        },
        data: {
          Active: true,
          onHold: false,
        },
      });
    }
  } catch (error) {
    throw new Error("Server Error chenge main");
  }
};
