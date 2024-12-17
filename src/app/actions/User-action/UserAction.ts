"use server";

import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const PostUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.family_name || !user?.email || !user?.picture) {
    throw new Error("Invalid user data");
  }

  const exisingUser = await db.user.findFirst({
    where: { 
      email:user.email
     },
  });

  if (!exisingUser) {
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
