"use client";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {ReactQueryDevtools } from '@tanstack/react-query-devtools'


const Provider = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
 
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (
    <QueryClientProvider client={queryClient}>
      
{children}
<ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default Provider;
