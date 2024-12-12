"use client"
import { Button } from "@/components/ui/button";

import { signIn, signOut, useSession } from "next-auth/react";


export default function Home() {
  const session = useSession()
  return (
   <div>
      <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}>{session ?  "LogIn":"null" } </button>
     
   </div>
  );
}
