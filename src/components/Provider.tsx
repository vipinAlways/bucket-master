"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Image from "next/image";
import Link from "next/link";
import { Settings } from "lucide-react";
import { items } from "@/app/constants/constant";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      
{children}
    </QueryClientProvider>
  );
};

export default Provider;
