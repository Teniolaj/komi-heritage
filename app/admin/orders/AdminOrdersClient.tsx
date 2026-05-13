"use client";

import { Clock, Loader2 } from "lucide-react";
import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
import type { OrderWithItemsAndProfile } from "@/lib/queries/admin";
import type { OrderStatus } from "@/lib/types";
import { updateOrderStatus } from "./actions";
import { usePolling } from "@/lib/hooks/use-polling";

type FilterKey = "all" | "received" | "preparing" | "ready" | "out_for_delivery" | "completed";
const PAGE_SIZE = 10;

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getNextStatus(current: OrderStatus): OrderStatus | null {
  const flow: Partial<Record<OrderStatus, OrderStatus>> = {
    received: "preparing",
    preparing: "ready",
    ready: "out_for_delivery",
    out_for_delivery: "delivered",
  };
  return flow[current] ?? null;
}

function getNextLabel(current: OrderStatus): string {
  const labels: Partial<Record<OrderStatus, string>> = {
    received: "Mark Prep",
    preparing: "Mark Ready",
    ready: "Mark Delivering",
    out_for_delivery: "Mark Done",
  };
  return labels[current] ?? "Done";
}

function getItemsSummary(order: OrderWithItemsAndProfile) {
  return order.order_items
    .map((item) => {
      let text = `${item.snapshot_name} x${item.quantity}`;
      if (item.selected_extras && item.selected_extras.length > 0) {
        const extrasStr = item.selected_extras.map(e => `${e.quantity}x ${e.name}`).join(", ");
        text += ` (+ ${extrasStr})`;
      }
      return text;
    })
    .join(" | ");
}

export default function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: OrderWithItemsAndProfile[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  usePolling<{ orders: OrderWithItemsAndProfile[] }>(
    "/api/admin/orders",
    useCallback((data) => {
      setOrders(data.orders);
    }, []),
    3_000,
  );

  const filteredOrders = useMemo(() => {
    if (filter === "all") return orders;
    if (filter === "completed") {
      return orders.filter((o) =>
        ["delivered", "picked_up", "cancelled"].includes(o.status),
      );
    }
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  const counts = useMemo(() => {
    const c = { received: 0, preparing: 0, ready: 0, out_for_delivery: 0, completed: 0 };
    for (const o of orders) {
      if (o.status === "received") c.received++;
      else if (o.status === "preparing") c.preparing++;
      else if (o.status === "ready") c.ready++;
      else if (o.status === "out_for_delivery") c.out_for_delivery++;
      else c.completed++;
    }
    return c;
  }, [orders]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(
    () => filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredOrders, page],
  );

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    startTransition(async () => {
      try {
        const updated = await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: updated.status } : o)),
        );
      } catch (err) {
        console.error("Failed to update order:", err);
      }
    });
  };

  const filters: { key: FilterKey; label: string }[] = [
    { key: "all", label: `All (${orders.length})` },
    { key: "received", label: `New (${counts.received})` },
    { key: "preparing", label: `Preparing (${counts.preparing})` },
    { key: "ready", label: `Ready (${counts.ready})` },
    { key: "out_for_delivery", label: `Delivering (${counts.out_for_delivery})` },
    { key: "completed", label: `Done (${counts.completed})` },
  ];

  return (
    <div className="flex flex-col h-full bg-surface-container-lowest">
      {/* Page Header */}
      <div className="px-6 md:px-8 py-6 flex items-center justify-between border-b border-outline-variant/20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface uppercase">Live Orders</h2>
            <div className="flex items-center gap-2 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-dm-sans text-[10px] font-bold uppercase tracking-tighter text-green-700">Live</span>
            </div>
          </div>
          <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mt-2">
            {orders.length} total orders
          </p>
        </div>
      </div>

      {/* Order Filter Navigation */}
      <div className="px-6 md:px-8 py-6 border-b border-outline-variant/20 bg-surface">
        <div className="flex gap-1 bg-surface-container-low md:p-1 w-full overflow-x-auto hide-scrollbar md:w-fit border border-outline-variant/10 rounded-xl">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 md:px-6 py-3 font-dm-sans font-bold text-[10px] md:text-xs uppercase tracking-widest whitespace-nowrap transition-colors rounded-lg cursor-pointer ${
                filter === f.key
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <section className="flex-1 overflow-x-auto px-6 md:px-8 py-2 min-h-[400px]">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-dm-sans text-sm text-on-surface-variant font-bold uppercase tracking-widest">
              No orders in this category
            </p>
            <p className="font-dm-sans text-xs text-on-surface-variant/60 mt-2">
              Orders will appear here as they come in.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[750px] mt-4">
            <thead className="sticky top-0 bg-surface-container-lowest z-20">
              <tr className="border-b border-outline-variant/30">
                <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Order ID</th>
                <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Customer & Items</th>
                <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Type</th>
                <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/30">Time</th>
                <th className="py-4 font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest text-right border-b border-outline-variant/30">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paginatedOrders.map((order) => {
                const nextStatus = getNextStatus(order.status);
                const isCompleted = ["delivered", "picked_up", "cancelled"].includes(order.status);
                return (
                  <tr key={order.id} className={`group hover:bg-surface-container-low transition-colors ${order.status === "preparing" ? "opacity-80" : ""}`}>
                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        {order.status === "received" ? (
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-sm"></span>
                        ) : order.status === "preparing" ? (
                          <Loader2 size={14} className="text-stone-400 animate-spin" />
                        ) : (
                          <span className="w-2 h-2 bg-stone-300 rounded-full"></span>
                        )}
                        <span className="font-headline text-lg font-bold text-on-surface">#{order.order_number}</span>
                      </div>
                    </td>
                    <td className="py-5 pr-4">
                      <div className="flex flex-col">
                        <span className="font-dm-sans font-bold text-sm text-on-surface">
                          {order.profile?.full_name ?? "Guest"}
                        </span>
                        <span className="font-dm-sans text-[10px] text-on-surface-variant uppercase mt-1 tracking-wider max-w-[250px] truncate">
                          {getItemsSummary(order)}
                        </span>
                      </div>
                    </td>
                    <td className="py-5">
                      <span className={`px-2 py-1 text-[9px] font-bold uppercase tracking-widest rounded-md capitalize ${
                        order.fulfillment_type === "delivery"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-surface-container-high text-on-surface-variant border border-outline-variant/30"
                      }`}>
                        {order.fulfillment_type}
                      </span>
                    </td>
                    <td className="py-5">
                      <div className="flex items-center gap-1.5 text-on-surface-variant">
                        <Clock size={14} />
                        <span className="font-dm-sans text-[10px] font-bold tracking-widest uppercase">{timeAgo(order.created_at)}</span>
                      </div>
                    </td>
                    <td className="py-5">
                      <div className="flex justify-end gap-2 md:gap-3">
                        {nextStatus && !isCompleted ? (
                          <button
                            onClick={() => handleStatusChange(order.id, nextStatus)}
                            disabled={isPending}
                            className="px-4 md:px-6 py-2 bg-primary text-white font-bold uppercase tracking-widest text-[9px] md:text-[10px] hover:bg-primary-container font-dm-sans transition-colors shrink-0 shadow-sm rounded-xl cursor-pointer disabled:opacity-50"
                          >
                            {isPending ? <Loader2 size={14} className="animate-spin" /> : getNextLabel(order.status)}
                          </button>
                        ) : (
                          <span className="px-4 md:px-6 py-2 bg-surface-container-high text-on-surface-variant font-bold uppercase tracking-widest text-[9px] md:text-[10px] font-dm-sans shrink-0 rounded-xl opacity-70 capitalize">
                            {order.status.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>

      {/* Kitchen Status Bar */}
      <footer className="min-h-16 px-6 md:px-8 py-4 border-t border-outline-variant/20 flex flex-col md:flex-row items-center justify-between gap-4 bg-surface-container mt-auto sm:flex shrink-0">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active:</span>
            <span className="font-dm-sans text-xs font-bold text-on-surface">
              {counts.received + counts.preparing + counts.ready + counts.out_for_delivery} orders
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-dm-sans text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Completed:</span>
            <span className="font-dm-sans text-xs font-bold text-secondary">{counts.completed}</span>
          </div>
        </div>
        {filteredOrders.length > PAGE_SIZE && (
          <div className="flex items-center gap-3">
            <span className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="h-9 px-3 rounded-lg border border-outline-variant/40 font-dm-sans text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 hover:bg-surface-container-high cursor-pointer"
              >
                Prev
              </button>
              <button
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="h-9 px-3 rounded-lg border border-outline-variant/40 font-dm-sans text-[10px] font-bold uppercase tracking-widest disabled:opacity-40 hover:bg-surface-container-high cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
