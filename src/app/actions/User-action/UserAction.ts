"use server";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const { getUser } = getKindeServerSession();
const user = await getUser();

export const PostUser = async () => {
  if (!user?.family_name || !user?.email || !user?.picture) {
    console.log("Invalid user data");
    return { success: false, message: "Invalid user data" };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const existingUser = await db.user.findUnique({
    where: { email: user.email },
  });

  if (!existingUser) {

    await db.user.create({
      data: {
        userName: user.family_name,
        email: user.email,
        Avatar: user.picture,
        lastActiveAt: today,
        streak: 1,
      },
    });
  } else {
    const lastActive = new Date(existingUser.lastActiveAt);
    lastActive.setHours(0, 0, 0, 0);

    const diffInDays = (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);

    if (diffInDays === 1) {
     
      await db.user.update({
        where: { email: user.email },
        data: { 
          streak: { increment: 1 }, 
          lastActiveAt: today 
        },
      });
    } else if (diffInDays > 1) {
    
      await db.user.update({
        where: { email: user.email },
        data: { 
          streak: 1, 
          lastActiveAt: today 
        },
      });
    }
  }

};

export const levelUpdate  = async (level: number) => {
  if (!user?.family_name || !user?.email || !user?.picture) {
    console.log("Invalid user data");
    return;
  }

  const existingUser = await db.user.findFirst({
    where: {
      email: user.email
    }
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