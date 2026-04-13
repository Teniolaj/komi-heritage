import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Order, OrderItem, Profile } from "@/lib/types";

export type OrderWithItems = Order & {
  order_items: OrderItem[];
};

export type OrderWithProfile = Order & {
  profile: Pick<Profile, "id" | "full_name" | "email" | "phone" | "role"> | null;
};

export async function getOrderById(
  orderId: string,
): Promise<OrderWithItems | null> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Failed to verify authenticated user: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Authentication required to fetch an order.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch order ${orderId}: ${error.message}`);
  }

  return data as OrderWithItems | null;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders for user ${userId}: ${error.message}`);
  }

  return data;
}

export async function getAllOrders(): Promise<OrderWithProfile[]> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    throw new Error(`Failed to verify authenticated user: ${authError.message}`);
  }

  if (!user) {
    throw new Error("Authentication required to fetch all orders.");
  }

  const { data: currentProfileData, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError) {
    throw new Error(`Failed to verify profile role: ${profileError.message}`);
  }

  const currentProfile = currentProfileData as Pick<Profile, "role">;

  if (!["staff", "admin"].includes(currentProfile.role)) {
    throw new Error("Only staff and admins can fetch all orders.");
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "*, profile:profiles!orders_user_id_fkey(id, full_name, email, phone, role)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all orders: ${error.message}`);
  }

  return data as OrderWithProfile[];
}
