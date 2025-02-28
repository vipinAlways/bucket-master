"use server";
import { db } from "@/lib/db";


export const getAllUser = async () => {
   try {
     const users = await db.user.findMany({
       orderBy: {
         points: "desc",
       },
     });
 
     return users; // No need for ?? null
   } catch (error) {
     console.error("Error fetching users:", error);
     throw new Error("Failed to fetch users");
   }
 };
 
