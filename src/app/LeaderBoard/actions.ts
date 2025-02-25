"use server";
import { db } from "@/lib/db";


export const getAllUser = async () => {
 try {
    return  await db.user.findMany()
     
 } catch (error) {
    throw new Error("Server Error");
 }
};
