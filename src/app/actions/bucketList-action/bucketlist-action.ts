"use server"
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { $Enums } from "@prisma/client";

interface TargetProps {
  duedate: Date;
  type: $Enums.typeOfTarget;
  budget: number;
  itemName:string
}

export const startTarget = async ({
  duedate,
  type,
  budget,
  itemName
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

    const isAlreadyHaveTarget = await db.bucketItems.findFirst({
      where: {
        userId: dbuser?.id,
        Active:true
      },
    });

    if (isAlreadyHaveTarget) {
      console.log(isAlreadyHaveTarget,"ye chahiye");
      throw new Error("Currently the target is on hold");
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
        remainingAmount: 0,
        ItemName:itemName ,
        Active:true      
      },
    });

    return createTarget;
  } catch (error) {
    console.log("error while creating target", error);
    throw new Error("error while creating target");
  }
};

export const activeBucketItem = async ()=>{
  await db.$connect()

  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user?.email) {
      throw new Error("Invalid user data");
    }
    const dbuser = await db.user.findFirst({
      where:{
        email:user.email
      }
    })

    if (!dbuser) throw new Error("no user with this email")
    return  await db.bucketItems.findFirst({
      where:{
        userId:dbuser.id,
        Active:true
      }
    })
    
  } catch (error) {
    console.log("error while find bucket item", error);
    throw new Error("error while bucket item");
  }
}


