"use server";

import { revalidatePath } from "next/cache";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order, OrderStatus } from "@/lib/types";

async function requireStaffOrAdmin(): Promise<string> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Authentication required.");
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || !["staff", "admin"].includes(profile.role as string)) {
    throw new Error("Only staff and admins can manage orders.");
  }

  return user.id;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<Order> {
  await requireStaffOrAdmin();

  if (!orderId) {
    throw new Error("Order ID is required.");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Failed to update order status: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/staff");

  return data as Order;
}

export async function updateMultipleOrderStatuses(
  orderIds: string[],
  newStatus: OrderStatus,
): Promise<Order[]> {
  await requireStaffOrAdmin();

  const uniqueOrderIds = Array.from(new Set(orderIds.filter(Boolean)));
  if (uniqueOrderIds.length === 0) {
    throw new Error("At least one order ID is required.");
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .in("id", uniqueOrderIds)
    .select("*");

  if (error) {
    throw new Error(`Failed to update order statuses: ${error.message}`);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/staff");

  return data as Order[];
}
