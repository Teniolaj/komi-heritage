"use server";

import { revalidatePath } from "next/cache";

import { requireMenuManagerRole } from "@/lib/queries/menu";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { MenuItem } from "@/lib/types";

type MenuItemInput = {
  name: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  category?: string;
  is_available?: boolean;
};

function normalizeMenuItemInput(input: MenuItemInput) {
  const name = input.name.trim();
  const description = input.description?.trim() || null;
  const imageUrl = input.image_url?.trim() || null;
  const category = input.category?.trim() || "kenkey";
  const price = Number(input.price);
  const isAvailable = input.is_available ?? true;

  if (!name) {
    throw new Error("Menu item name is required.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Menu item price must be a valid positive number.");
  }

  return {
    name,
    description,
    price,
    image_url: imageUrl,
    category,
    is_available: isAvailable,
  };
}

function revalidateMenuPaths() {
  revalidatePath("/menu");
  revalidatePath("/admin/menu");
}

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  await requireMenuManagerRole();

  const payload = normalizeMenuItemInput(input);
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to create menu item: ${error.message}`);
  }

  revalidateMenuPaths();

  return data;
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput,
): Promise<MenuItem> {
  await requireMenuManagerRole();

  if (!id) {
    throw new Error("Menu item id is required.");
  }

  const payload = normalizeMenuItemInput(input);
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update menu item: ${error.message}`);
  }

  revalidateMenuPaths();

  return data;
}

export async function toggleMenuItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<MenuItem> {
  await requireMenuManagerRole();

  if (!id) {
    throw new Error("Menu item id is required.");
  }

  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to toggle availability: ${error.message}`);
  }

  revalidateMenuPaths();

  return data;
}

export async function deleteMenuItem(id: string): Promise<{ id: string }> {
  await requireMenuManagerRole();

  if (!id) {
    throw new Error("Menu item id is required.");
  }

  const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete menu item: ${error.message}`);
  }

  revalidateMenuPaths();

  return { id };
}
