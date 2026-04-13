import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { MenuItem } from "@/lib/types";

export async function getMenuItems(): Promise<MenuItem[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return data;
}
