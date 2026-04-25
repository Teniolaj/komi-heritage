"use client";

import { usePathname } from "next/navigation";

export function ClientMain({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <main className={`flex-1 flex flex-col ${isAdmin ? "" : "mt-[72px] md:mt-[80px]"}`}>
      {children}
    </main>
  );
}
