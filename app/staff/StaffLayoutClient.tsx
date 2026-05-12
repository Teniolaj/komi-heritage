"use client";

import { ReactNode } from "react";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function StaffLayoutClient({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#111111] text-stone-100 min-h-screen font-body flex flex-col relative">
      {children}
    </div>
  );
}
