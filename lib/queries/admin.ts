import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { Order, OrderItem, Profile } from "@/lib/types";

// ─── Types ──────────────────────────────────────────────────────────────────

export type OrderWithItemsAndProfile = Order & {
  order_items: (OrderItem & { menu_item: { name: string } | null })[];
  profile: Pick<Profile, "id" | "full_name" | "email" | "phone"> | null;
};

export type CustomerWithStats = Pick<
  Profile,
  "id" | "full_name" | "email" | "phone" | "saved_address" | "created_at"
> & {
  order_count: number;
  total_spent: number;
  last_order_at: string | null;
};

export type AdminOverviewStats = {
  totalOrdersToday: number;
  revenueToday: number;
  activeOrders: number;
  preparingCount: number;
  deliveringCount: number;
  totalCustomers: number;
  newCustomersToday: number;
};

// ─── Admin Overview Stats ───────────────────────────────────────────────────

export async function getAdminOverviewStats(): Promise<AdminOverviewStats> {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  // Fetch today's orders
  const { data: todayOrders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("id, total, status, created_at")
    .gte("created_at", todayISO);

  if (ordersError) {
    throw new Error(`Failed to fetch today's orders: ${ordersError.message}`);
  }

  const totalOrdersToday = todayOrders?.length ?? 0;
  const revenueToday = todayOrders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  // Fetch active orders (not completed/cancelled)
  const { data: activeOrderRows, error: activeError } = await supabaseAdmin
    .from("orders")
    .select("status")
    .in("status", ["received", "preparing", "ready", "out_for_delivery"]);

  if (activeError) {
    throw new Error(`Failed to fetch active orders: ${activeError.message}`);
  }

  const activeOrders = activeOrderRows?.length ?? 0;
  const preparingCount = activeOrderRows?.filter((o) => o.status === "preparing").length ?? 0;
  const deliveringCount = activeOrderRows?.filter((o) => o.status === "out_for_delivery").length ?? 0;

  // Total customers
  const { count: totalCustomers, error: customerError } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("role", "eq", "admin")
    .not("role", "eq", "staff");

  if (customerError) {
    throw new Error(`Failed to count customers: ${customerError.message}`);
  }

  // New customers today
  const { count: newCustomersToday, error: newCustError } = await supabaseAdmin
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .not("role", "eq", "admin")
    .not("role", "eq", "staff")
    .gte("created_at", todayISO);

  if (newCustError) {
    throw new Error(`Failed to count new customers: ${newCustError.message}`);
  }

  return {
    totalOrdersToday,
    revenueToday,
    activeOrders,
    preparingCount,
    deliveringCount,
    totalCustomers: totalCustomers ?? 0,
    newCustomersToday: newCustomersToday ?? 0,
  };
}

// ─── All Orders (with items + profile) for Admin ────────────────────────────

export async function getAllOrdersForAdmin(): Promise<OrderWithItemsAndProfile[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `*, 
       order_items(*, menu_item:menu_items(name)), 
       profile:profiles!orders_user_id_fkey(id, full_name, email, phone)`,
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch all orders for admin: ${error.message}`);
  }

  return data as unknown as OrderWithItemsAndProfile[];
}

// ─── Recent Orders (for overview page) ──────────────────────────────────────

export async function getRecentOrders(limit = 5): Promise<OrderWithItemsAndProfile[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `*, 
       order_items(*, menu_item:menu_items(name)), 
       profile:profiles!orders_user_id_fkey(id, full_name, email, phone)`,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch recent orders: ${error.message}`);
  }

  return data as unknown as OrderWithItemsAndProfile[];
}

// ─── Customers list with stats ──────────────────────────────────────────────

export async function getCustomersWithStats(): Promise<CustomerWithStats[]> {
  // Get all profiles that are NOT admin or staff (i.e. customers, including null roles)
  const { data: profiles, error: profilesError } = await supabaseAdmin
    .from("profiles")
    .select("id, full_name, email, phone, saved_address, created_at")
    .not("role", "eq", "admin")
    .not("role", "eq", "staff")
    .order("created_at", { ascending: false });

  if (profilesError) {
    throw new Error(`Failed to fetch customers: ${profilesError.message}`);
  }

  if (!profiles || profiles.length === 0) {
    return [];
  }

  // Get order stats per customer
  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("user_id, total, created_at")
    .in(
      "user_id",
      profiles.map((p) => p.id),
    );

  if (ordersError) {
    throw new Error(`Failed to fetch customer order stats: ${ordersError.message}`);
  }

  // Aggregate per user
  const statsMap = new Map<string, { count: number; total: number; lastAt: string | null }>();
  for (const order of orders ?? []) {
    const existing = statsMap.get(order.user_id) ?? { count: 0, total: 0, lastAt: null };
    existing.count += 1;
    existing.total += Number(order.total);
    if (!existing.lastAt || order.created_at > existing.lastAt) {
      existing.lastAt = order.created_at;
    }
    statsMap.set(order.user_id, existing);
  }

  return profiles.map((p) => {
    const stats = statsMap.get(p.id) ?? { count: 0, total: 0, lastAt: null };
    return {
      ...p,
      order_count: stats.count,
      total_spent: stats.total,
      last_order_at: stats.lastAt,
    };
  });
}
