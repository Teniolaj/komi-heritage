"use client";

import { useState, useCallback } from "react";
import { ShoppingCart, CircleDollarSign, Users, TrendingUp, ChevronDown } from "lucide-react";
import type { AdminOverviewStats, OrderWithItemsAndProfile } from "@/lib/queries/admin";
import { usePolling } from "@/lib/hooks/use-polling";

function formatCurrency(amount: number) {
  return `₵ ${amount.toLocaleString("en-GH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

function statusLabel(status: string) {
  const map: Record<string, { label: string; classes: string }> = {
    received: { label: "New", classes: "bg-green-50 text-green-700 border border-green-200" },
    preparing: { label: "In Kitchen", classes: "bg-primary text-white shadow-sm" },
    ready: { label: "Ready", classes: "bg-[#feca5a]/20 text-[#7a5900] border border-[#feca5a]/40" },
    out_for_delivery: { label: "Delivering", classes: "bg-blue-50 text-blue-700 border border-blue-200" },
    delivered: { label: "Delivered", classes: "bg-stone-200 text-stone-700 border border-stone-300" },
    picked_up: { label: "Picked Up", classes: "bg-stone-200 text-stone-700 border border-stone-300" },
    cancelled: { label: "Cancelled", classes: "bg-red-50 text-red-600 border border-red-200" },
  };
  return map[status] ?? { label: status, classes: "bg-stone-200 text-stone-700" };
}

function getItemsSummary(order: OrderWithItemsAndProfile) {
  return order.order_items
    .map((item) => `${item.quantity}x ${item.snapshot_name}`)
    .join(", ");
}

export default function AdminOverviewClient({
  stats: initialStats,
  recentOrders: initialOrders,
}: {
  stats: AdminOverviewStats;
  recentOrders: OrderWithItemsAndProfile[];
}) {
  const [stats, setStats] = useState(initialStats);
  const [recentOrders, setRecentOrders] = useState(initialOrders);

  usePolling<{ stats: AdminOverviewStats; recentOrders: OrderWithItemsAndProfile[] }>(
    "/api/admin/overview",
    useCallback((data) => {
      setStats(data.stats);
      setRecentOrders(data.recentOrders);
    }, []),
    10_000,
  );

  const inKitchenCount = stats.preparingCount;
  const outForDeliveryCount = stats.deliveringCount;

  return (
    <div className="p-6 md:p-8 space-y-8 md:space-y-12 max-w-[1600px] mx-auto">
      {/* Overview Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Card 1 - Total Orders Today */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total Orders Today</span>
            <ShoppingCart className="text-primary group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">{stats.totalOrdersToday}</span>
            <span className="text-on-surface-variant text-xs font-bold mt-2 font-dm-sans">
              orders placed today
            </span>
          </div>
        </div>
        
        {/* Card 2 - Revenue Today */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Revenue Today</span>
            <CircleDollarSign className="text-secondary group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">{formatCurrency(stats.revenueToday)}</span>
            <span className="text-on-surface-variant text-xs font-bold mt-2 font-dm-sans">total revenue</span>
          </div>
        </div>

        {/* Card 3 - Active Orders */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all group relative overflow-hidden cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Active Orders</span>
            {stats.activeOrders > 0 && (
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(157,5,24,0.6)]"></div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">{stats.activeOrders}</span>
            <span className="text-on-surface-variant text-[10px] md:text-xs font-bold mt-2 font-dm-sans uppercase tracking-widest">
              {inKitchenCount} in kitchen • {outForDeliveryCount} out for delivery
            </span>
          </div>
        </div>

        {/* Card 4 - Total Customers */}
        <div className="bg-surface-container-lowest p-6 md:p-8 rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:bg-surface-container-low transition-all group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total Customers</span>
            <Users className="text-on-surface-variant group-hover:scale-110 transition-transform" size={18} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-4xl lg:text-5xl font-black">{stats.totalCustomers.toLocaleString()}</span>
            <span className="text-on-surface-variant text-xs font-bold mt-2 flex items-center gap-1 font-dm-sans">
              {stats.newCustomersToday > 0 && <TrendingUp size={14} className="text-emerald-700" />}
              {stats.newCustomersToday} new today
            </span>
          </div>
        </div>
      </section>

      {/* Recent Orders Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2 border-b border-outline-variant/20 pb-4">
          <div>
            <p className="font-dm-sans text-[9px] text-secondary font-bold uppercase tracking-[0.2em] mb-1">Live Transaction Log</p>
            <h3 className="font-headline text-2xl font-bold">Recent Orders</h3>
          </div>
          <a href="/admin/orders" className="font-dm-sans text-[10px] font-bold uppercase tracking-widest hover:text-primary transition-colors text-primary border-b border-primary pb-px self-start sm:self-auto cursor-pointer">
            View All Orders
          </a>
        </div>
        
        <div className="overflow-x-auto hide-scrollbar -mx-6 px-6 md:mx-0 md:px-0">
          {recentOrders.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-outline-variant/30 rounded-2xl">
              <p className="font-dm-sans text-sm text-on-surface-variant font-bold uppercase tracking-widest">No orders yet</p>
              <p className="font-dm-sans text-xs text-on-surface-variant/60 mt-2">Orders will appear here once customers start ordering.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Order #</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Customer</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Items</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Total</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Fulfillment</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">Status</th>
                  <th className="py-2 px-3 font-dm-sans text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {recentOrders.map((order) => {
                  const st = statusLabel(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-low transition-colors group cursor-pointer">
                      <td className="py-4 px-3 font-dm-sans text-xs font-bold">#{order.order_number}</td>
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-white flex items-center justify-center font-bold font-headline text-xs shrink-0 rounded-full">
                            {(order.profile?.full_name ?? "?").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-dm-sans text-xs font-bold uppercase tracking-wider">
                            {order.profile?.full_name ?? "Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-3 font-dm-sans text-xs text-on-surface-variant max-w-[200px] truncate">
                        {getItemsSummary(order)}
                      </td>
                      <td className="py-4 px-3 font-dm-sans text-xs font-bold">{formatCurrency(Number(order.total))}</td>
                      <td className="py-4 px-3 font-dm-sans text-[10px] uppercase tracking-widest font-bold capitalize">{order.fulfillment_type}</td>
                      <td className="py-4 px-3">
                        <span className={`inline-block px-3 py-1 font-dm-sans text-[9px] font-bold uppercase tracking-widest rounded-md ${st.classes}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="py-4 px-3 font-dm-sans text-[9px] font-bold text-on-surface-variant text-right uppercase tracking-[0.1em]">
                        {timeAgo(order.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
