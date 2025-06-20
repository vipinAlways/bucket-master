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
    if (!dbuser || !dbuser.id) console.log("no user with this email");

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

    await db.user.update({
      where: {
        id: dbuser?.id,
      },
      data: {
        points: {
          increment: 20,
        },
      },
    });

    return createTarget;
  } catch (error) {
    console.log("error while creating target", error);
    return;
  }
};
export const activeBucketItem = async () => {
  try {
    const user = await getUser();
    if (!user?.email) {
      throw new Error("User is not Authenticated");
    }

    const dbuser = await db.user.findFirst({
      where: { email: user.email },
      select: { id: true },
    });

    const active = await db.bucketItems.findFirst({
      where: { userId: dbuser?.id, Active: true },
    });

    return active;
  } catch (error) {
    console.log("Error while finding bucket item:", error);
    return null;
  }
};

export const remainingAmountIncrease = async ({
  remainingAmount,
}: {
  remainingAmount: number;
}) => {
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
      select: { id: true },
    });

    if (!dbuser) {
      throw new Error("no user with this email");
    }
    const activeBucket = await db.bucketItems.findFirst({
      where: {
        userId: dbuser.id,
        Active: true,
      },
    });

    return await db.bucketItems.update({
      where: {
        id: activeBucket?.id,
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

export const holdOrAchive = async ({ todo }: { todo: string }) => {
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
        Achieved: false,
      },
    });

    if (!activeBucket) {
      console.log("no active bucket");
      return;
    }

    if (todo === "hold") {
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
    }
    if (todo === "achieve") {
      const hasAchieve = await db.bucketItems.update({
        where: {
          id: activeBucket.id,
        },
        data: {
          Active: false,
          Achieved: true,
        },
      });
      const pointUpdate = await db.user.update({
        where: {
          id: activeBucket.userId,
        },
        data: {
          points: {
            increment: Math.floor(activeBucket.budget ?? 0 / 10),
          },
        },
      });
      return {
        hasAchieve,
        pointUpdate,
      };
    }
  } catch (error) {
    console.log("error while holding bucket item server", error);
    console.log("error while bucket item server holding");
  }
};
export const failedTOAcheive = async () => {
  try {
    const user = await getUser();
    if (!user?.email) {
      throw new Error("User is not Authenticated");
    }

    const dbuser = await db.user.findFirst({
      where: { email: user.email },
    });

    if (!dbuser) {
      console.log("No user with this email:", user.email);
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

    if (!activeBucket) {
      return;
    }

    if (!activeBucket.budget) {
      console.log("Active bucket has no budget");
      return;
    }

    if (activeBucket.duedate) {
      const dueDate = new Date(activeBucket.duedate);
      const now = new Date();

      if (dueDate < now) {
        try {
          const updatedBucket = await db.bucketItems.update({
            where: { id: activeBucket.id },
            data: { failed: true, Active: false },
          });

          return updatedBucket;
        } catch (updateError) {
          console.log("Error while updating bucket status:", updateError);
        }
      } else {
        console.log("Bucket duedate not reached:", dueDate);
      }
    } else {
      console.log("No duedate found for bucket:", activeBucket.id);
    }
  } catch (error) {
    console.log("Error in failedTOAcheive function:", error);
    throw new Error("Error in failedTOAcheive function:");
  }
};

export const getFailedToAchieve = async () => {
  try {
    const user = await getUser();
    if (!user?.email) {
      throw new Error("User is not authenticated");
    }

    const dbUser = await db.user.findFirst({
      where: { email: user.email },
      include: {
        BucketItem: {
          where: { failed: true, Active: false },
        },
      },
    });

    if (!dbUser || !dbUser.BucketItem?.length) {
      return [];
    }

    return dbUser.BucketItem;
  } catch (error) {
    throw new Error("Failed to retrieve failed bucket items", error ?? "");
  }
};

export const reActiveTask = async ({
  targetId,
  duedate,
}: {
  targetId: string;
  duedate?: Date;
}) => {
  try {
    const user = await getUser();
    if (!user?.email) {
      throw new Error("User is not Authenticated");
    }

    const dbuser = await db.user.findFirst({
      where: { email: user.email },
      select: { id: true },
    });

    if (!dbuser) {
      throw new Error("User not found");
    }

    const [activeTask, targetItem] = await Promise.all([
      db.bucketItems.findFirst({
        where: { userId: dbuser.id, Active: true },
      }),
      db.bucketItems.findFirst({
        where: { id: targetId, userId: dbuser.id },
        select: { id: true, Active: true, failed: true, onHold: true },
      }),
    ]);

    if (activeTask) {
      throw new Error("You already have an active task. Complete it first!");
    }

    if (!targetItem) {
      throw new Error("Target item not found");
    }

    if (targetItem.failed) {
      if (!duedate) {
        throw new Error("Due date is required to restart the challenge");
      }
      return await db.bucketItems.update({
        where: { id: targetId },
        data: { Active: true, failed: false, duedate },
      });
    }

    if (targetItem.onHold) {
      return await db.bucketItems.update({
        where: { id: targetId },
        data: { Active: true, onHold: false, ...(duedate && { duedate }) },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Server Error");
  }
};

export async function trackRecord() {
  try {
    const user = await getUser();

    if (!user?.email) {
      throw new Error("User is not authenticated");
    }

    const dbUser = await db.user.findFirst({
      where: { email: user.email },
    });

    if (!dbUser) {
      throw new Error("User is not registered");
    }

    const [achievedTarget, holdTarget, failedTarget] = await Promise.all([
      db.bucketItems.findMany({
        where: { userId: dbUser.id, Achieved: true },
      }),
      db.bucketItems.findMany({
        where: { userId: dbUser.id, onHold: true, failed: false },
      }),
      db.bucketItems.findMany({
        where: { userId: dbUser.id, failed: true, onHold: false },
      }),
    ]);

    return {
      achievedTarget,
      achiveCount: achievedTarget.length,
      holdTarget,
      holdCount: holdTarget.length,
      failedTarget,
      failedCount: failedTarget.length,
    };
  } catch (error) {
    throw new Error(`Error in trackRecord: ${error}`);
  }
}
