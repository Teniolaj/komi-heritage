import "server-only";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MenuItem, Profile, UserRole } from "@/lib/types";

type MenuManagerRole = Extract<UserRole, "admin" | "staff">;

export async function getAvailableMenuItems(): Promise<MenuItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true);

  if (error) {
    throw new Error(`Failed to fetch available menu items: ${error.message}`);
  }

  return data;
}

export async function requireMenuManagerRole(): Promise<{
  userId: string;
  role: MenuManagerRole;
}> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Failed to verify authenticated user: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Authentication required to manage menu items.");
  }

  const { data: profileData, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to verify profile role: ${profileError.message}`);
  }

  const profile = profileData as Pick<Profile, "role">;

  if (!["admin", "staff"].includes(profile.role)) {
    throw new Error("Only staff and admins can manage menu items.");
  }

  return {
    userId: user.id,
    role: profile.role as MenuManagerRole,
  };
}

export async function getAllMenuItemsForManager(): Promise<MenuItem[]> {
  await requireMenuManagerRole();

  const { data, error } = await supabaseAdmin.from("menu_items").select("*");

  if (error) {
    throw new Error(`Failed to fetch all menu items: ${error.message}`);
  }

  return data;
}
