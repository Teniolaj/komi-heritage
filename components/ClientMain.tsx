"use client";

import { usePathname } from "next/navigation";

export function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullBleed = pathname?.startsWith("/admin") || pathname?.startsWith("/staff");

  return (
    <main className={`flex-1 flex flex-col ${isFullBleed ? "" : "mt-[72px] md:mt-[80px]"}`}>
      {children}
    </main>
  );
}
