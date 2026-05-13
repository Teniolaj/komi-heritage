"use client";

import { Clock, AlertTriangle, Loader2, MapPin, Store, LogOut } from "lucide-react";
import { useEffect, useState, useTransition, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithItemsAndProfile } from "@/lib/queries/admin";
import type { OrderStatus } from "@/lib/types";
import { updateMultipleOrderStatuses, updateOrderStatus } from "@/app/admin/orders/actions";
import { usePolling } from "@/lib/hooks/use-polling";

type FilterKey = "received" | "preparing" | "ready" | "out_for_delivery" | "completed";
type BulkStatus = Extract<OrderStatus, "preparing" | "ready" | "out_for_delivery" | "delivered" | "picked_up" | "cancelled">;

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
    received: "Mark Preparing",
    preparing: "Mark Ready",
    ready: "Mark Delivering",
    out_for_delivery: "Mark Delivered",
  };
  return labels[current] ?? "Done";
}

export default function StaffOrdersClient({
  initialOrders,
}: {
  initialOrders: OrderWithItemsAndProfile[];
}) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState<FilterKey>("received");
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(() => Date.now());
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<BulkStatus>("preparing");

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  usePolling<{ orders: OrderWithItemsAndProfile[] }>(
    "/api/admin/orders",
    useCallback((data) => {
      setOrders(data.orders);
    }, []),
    3_000,
  );

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

  const filteredOrders = useMemo(() => {
    if (activeTab === "completed") {
      return orders.filter((o) =>
        ["delivered", "picked_up", "cancelled"].includes(o.status),
      );
    }
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

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

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const selectVisibleOrders = () => {
    setSelectedOrderIds(filteredOrders.map((order) => order.id));
  };

  const clearSelection = () => {
    setSelectedOrderIds([]);
  };

  const handleBulkStatusChange = () => {
    if (selectedOrderIds.length === 0) return;

    const idsToUpdate = selectedOrderIds;
    startTransition(async () => {
      try {
        const updatedOrders = await updateMultipleOrderStatuses(idsToUpdate, bulkStatus);
        const updatedById = new Map(updatedOrders.map((order) => [order.id, order.status]));
        setOrders((prev) =>
          prev.map((order) => {
            const nextStatus = updatedById.get(order.id);
            return nextStatus ? { ...order, status: nextStatus } : order;
          }),
        );
        setSelectedOrderIds([]);
      } catch (err) {
        console.error("Failed to update selected orders:", err);
      }
    });
  };

  const tabs: { key: FilterKey; label: string }[] = [
    { key: "received", label: `New (${counts.received})` },
    { key: "preparing", label: `Preparing (${counts.preparing})` },
    { key: "ready", label: `Ready (${counts.ready})` },
    { key: "out_for_delivery", label: `Out for Delivery (${counts.out_for_delivery})` },
    { key: "completed", label: `Done (${counts.completed})` },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Top Header & Tabs */}
      <div className="px-6 py-6 border-b border-white/5 shrink-0 bg-[#111111]">
        <div className="flex flex-col gap-5">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-red-500 font-headline italic text-2xl md:text-3xl tracking-tighter leading-tight font-bold mb-1">
                KOMI HERITAGE
              </h1>
              <p className="font-dm-sans font-bold uppercase tracking-widest text-[10px] text-stone-500">Live Orders / Kitchen Display</p>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer bg-stone-900 border border-white/10 hover:bg-red-900/20 hover:text-red-500 hover:border-red-900/50 transition-all text-stone-400 text-[10px] uppercase tracking-widest font-bold rounded-lg"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
          
          <div className="flex gap-1 bg-stone-950 p-1 w-full md:w-max max-w-full border border-white/5 overflow-x-auto rounded-xl hide-scrollbar">
            {tabs.map((tab) => (
              <button 
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 cursor-pointer rounded-lg font-dm-sans font-bold text-xs uppercase tracking-widest transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#1a1a1a] text-white border border-white/10 shadow-sm"
                    : "text-stone-500 hover:text-stone-300 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3 rounded-2xl border border-white/5 bg-stone-950 p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={selectVisibleOrders}
                disabled={filteredOrders.length === 0}
                className="rounded-lg border border-white/10 px-3 py-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-stone-300 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                Select Visible
              </button>
              <button
                onClick={clearSelection}
                disabled={selectedOrderIds.length === 0}
                className="rounded-lg border border-white/10 px-3 py-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-200 disabled:opacity-40 cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-1 flex-col sm:flex-row sm:items-center gap-3">
              <span className="font-dm-sans text-[10px] font-bold uppercase tracking-widest text-stone-500">
                {selectedOrderIds.length} selected
              </span>
              <select
                value={bulkStatus}
                onChange={(event) => setBulkStatus(event.target.value as BulkStatus)}
                className="rounded-lg border border-white/10 bg-[#111111] px-3 py-2 font-dm-sans text-xs font-bold uppercase tracking-widest text-stone-200 outline-none"
              >
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="picked_up">Picked Up</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={handleBulkStatusChange}
                disabled={selectedOrderIds.length === 0 || isPending}
                className="rounded-lg bg-[#9d0518] px-4 py-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-white hover:bg-red-800 disabled:opacity-40 cursor-pointer"
              >
                {isPending ? "Updating..." : "Update Selected"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Order List */}
      <div className="flex-1 overflow-y-auto px-6 py-6 custom-dark-scroll">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-dm-sans text-sm text-stone-500 font-bold uppercase tracking-widest">
                No orders in this category
              </p>
              <p className="font-dm-sans text-xs text-stone-600 mt-2">
                Orders will appear here as they come in.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              const isNew = order.status === "received";
              const isPreparing = order.status === "preparing";
              const isCompleted = ["delivered", "picked_up", "cancelled"].includes(order.status);
              const elapsedMin = Math.floor((now - new Date(order.created_at).getTime()) / 60000);
              const isUrgent = elapsedMin > 15 && (isNew || isPreparing);
              const isSelected = selectedOrderIds.includes(order.id);

              return (
                <div
                  key={order.id}
                  className={`flex flex-col md:flex-row group transition-all duration-300 rounded-2xl overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-[#feca5a] border-[#feca5a]/60"
                      : ""
                  } ${
                    isUrgent
                      ? "bg-[#1a1515] border border-orange-900/30 hover:border-orange-500/50"
                      : isPreparing
                        ? "bg-[#111111] border border-[#9d0518]/30"
                        : isCompleted
                          ? "bg-stone-900/50 border border-white/5 opacity-70"
                          : "bg-stone-900 border border-white/5 hover:border-[#9d0518]/50"
                  }`}
                >
                  {/* Status & ID Column */}
                  <div className={`p-6 md:w-64 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-center ${
                    isPreparing ? "bg-stone-950/80" : "bg-stone-950/50"
                  }`}>
                    <label className="mb-4 flex items-center gap-2 font-dm-sans text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleOrderSelection(order.id)}
                        className="h-4 w-4 accent-[#feca5a]"
                      />
                      Select
                    </label>
                    <span className={`text-[9px] font-dm-sans font-bold uppercase tracking-[0.2em] mb-2 flex items-center gap-1.5 ${
                      isUrgent
                        ? "text-orange-500"
                        : isPreparing
                          ? "text-stone-400"
                          : isNew
                            ? "text-[#feca5a]"
                            : "text-stone-500"
                    }`}>
                      {isUrgent && <AlertTriangle size={10} />}
                      {isPreparing && <Loader2 size={10} className="animate-spin text-[#9d0518]" />}
                      {isNew && !isUrgent ? "ASAP Order" : isPreparing ? "In Progress" : isUrgent ? `Waiting ${elapsedMin}m` : order.status.replace("_", " ")}
                    </span>
                    <h3 className="font-headline text-3xl font-bold text-white mb-2">#{order.order_number}</h3>
                    <p className="font-dm-sans text-stone-400 font-bold text-sm uppercase tracking-widest">
                      {order.profile?.full_name ?? "Guest"}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase text-white tracking-[0.15em] ${
                        order.fulfillment_type === "delivery" ? "bg-[#9d0518]" : "bg-stone-700"
                      }`}>
                        {order.fulfillment_type === "delivery" ? "Delivery" : "Pickup"}
                      </span>
                      <span className={`text-[10px] rounded-md font-bold flex items-center gap-1 font-dm-sans px-2 py-1 ${
                        isUrgent
                          ? "text-orange-500 bg-orange-500/10"
                          : "text-[#9d0518] bg-[#9d0518]/10"
                      }`}>
                        <Clock size={12} />
                        {timeAgo(order.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Items Column */}
                  <div className={`p-6 flex-1 ${isPreparing ? "bg-stone-950/30" : "bg-stone-900/40"}`}>
                    <p className="text-[9px] font-dm-sans font-bold text-stone-500 uppercase tracking-[0.2em] mb-4">Items</p>
                    <div className="space-y-2">
                      {order.order_items.map((item, idx) => (
                        <div
                          key={item.id}
                          className={`flex justify-between items-start bg-[#111111] p-3 border-l-4 rounded-r-xl ${
                            idx === 0 && isNew
                              ? "border-l-[#9d0518]"
                              : isUrgent && idx === order.order_items.length - 1
                                ? "border-l-orange-500 border border-orange-900/30"
                                : "border-l-transparent"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-stone-200 font-dm-sans">
                              {item.snapshot_name} <span className="text-stone-500">x{item.quantity}</span>
                            </span>
                            {item.selected_extras && item.selected_extras.length > 0 && (
                              <div className="mt-1 flex flex-col gap-0.5">
                                {item.selected_extras.map((extra, eIdx) => (
                                  <span key={eIdx} className="text-[10px] font-dm-sans font-bold uppercase tracking-widest text-[#feca5a]">
                                    + {extra.quantity}x {extra.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2 text-stone-400 mt-4 pt-4 border-t border-white/5">
                      {order.fulfillment_type === "delivery" ? (
                        <>
                          <MapPin size={12} className="text-stone-500" />
                          <p className="text-xs font-dm-sans font-bold text-stone-300">{order.delivery_address ?? "No address"}</p>
                        </>
                      ) : (
                        <>
                          <Store size={12} className="text-stone-500" />
                          <p className="text-xs font-dm-sans font-bold text-stone-300">Pickup</p>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions Column */}
                  <div className={`p-6 md:w-48 border-t md:border-t-0 md:border-l border-white/5 flex flex-col gap-3 justify-center ${
                    isPreparing ? "bg-stone-950/30" : "bg-stone-900/40"
                  }`}>
                    {nextStatus && !isCompleted ? (
                      <button
                        onClick={() => handleStatusChange(order.id, nextStatus)}
                        disabled={isPending}
                        className={`w-full cursor-pointer rounded-xl font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 transition-colors shadow-sm outline-none disabled:opacity-50 ${
                          isPreparing
                            ? "bg-[#241a1a] border border-[#9d0518]/30 text-[#9d0518] hover:bg-[#9d0518] hover:text-white"
                            : "bg-[#9d0518] text-white hover:bg-red-800"
                        }`}
                      >
                        {isPending ? <Loader2 size={14} className="animate-spin mx-auto" /> : getNextLabel(order.status)}
                      </button>
                    ) : isCompleted ? (
                      <span className="w-full text-center rounded-xl font-dm-sans font-bold uppercase tracking-[0.2em] text-[10px] py-4 text-stone-500 bg-stone-800/50 capitalize">
                        {order.status.replace("_", " ")}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
