import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/admin");
  }

  // Fetch the user's role securely using admin client to avoid RLS issues
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    // If they are a staff member trying to access admin, redirect to staff
    if (profile?.role === "staff") {
      redirect("/staff");
    }
    // Otherwise redirect to customer home
    redirect("/");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
