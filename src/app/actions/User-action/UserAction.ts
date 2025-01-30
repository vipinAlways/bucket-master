"use server";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getUser } = getKindeServerSession();
const user = await getUser();

export const PostUser = async () => {
  if (!user?.family_name || !user?.email || !user?.picture) {
    console.log("Invalid user data");
    return;
  }

  const existingUser = await db.user.findFirst({
    where: { 
      email:user.email
     },
  });

  if (!existingUser) {
    await db.user.create({
      data: {
        userName: user.family_name,
        email: user.email,
        Avatar: user.picture,
      },
    });
  }

  return { success: true };
};

export const levelUpdate  = async (level: number) => {
  if (!user?.family_name || !user?.email || !user?.picture) {
    console.log("Invalid user data");
    return;
  }

  const existingUser = await db.user.findFirst({
    where: { 
      email:user.email
     },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  const updatedLevel = await db.user.update({
    where:{id:existingUser.id},
    data:{
      level:level
    }
  })
  return {
    updatedLevel,
    success:true
  }
  
}