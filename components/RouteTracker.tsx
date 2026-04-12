"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { saveLastVisit } from "@/components/ContinueCard";

export function RouteTracker() {
  const pathname = usePathname();

  useEffect(() => {
    saveLastVisit(pathname);
  }, [pathname]);

  return null;
}
