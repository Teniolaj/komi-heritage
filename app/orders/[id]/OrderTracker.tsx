"use client";

import { PageWrapper } from "@/components/PageWrapper";
import Link from "next/link";
import {
  ShoppingBag,
  Clock,
  Check,
  UtensilsCrossed,
  PackageOpen,
  Bike,
  CheckCheck,
  MessageCircle,
  Store,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderStatus, FulfillmentType } from "@/lib/types";

export type OrderData = {
  id: string;
  order_number: string;
  status: OrderStatus;
  fulfillment_type: FulfillmentType;
  delivery_address: string | null;
  subtotal: number;
  delivery_fee: number;
  total: number;
  note: string | null;
  created_at: string;
  updated_at: string;
  order_items: {
    id: string;
    snapshot_name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }[];
};

const STATUS_STEPS: { key: OrderStatus; label: string; icon: typeof Check; description: string }[] = [
  { key: "received", label: "Received", icon: Check, description: "We've locked in your heritage selection." },
  { key: "preparing", label: "Preparing", icon: UtensilsCrossed, description: "Your order is being prepared fresh — sit tight!" },
  { key: "ready", label: "Ready", icon: PackageOpen, description: "Hand-packed and quality checked." },
  { key: "out_for_delivery", label: "Out for Delivery", icon: Bike, description: "The Collector is en route to your location." },
  { key: "delivered", label: "Delivered", icon: CheckCheck, description: "Enjoy your piece of the archive." },
];

const PICKUP_STATUS_STEPS: { key: OrderStatus; label: string; icon: typeof Check; description: string }[] = [
  { key: "received", label: "Received", icon: Check, description: "We've locked in your heritage selection." },
  { key: "preparing", label: "Preparing", icon: UtensilsCrossed, description: "Your order is being prepared fresh — sit tight!" },
  { key: "ready", label: "Ready for Pickup", icon: PackageOpen, description: "Your order is ready! Come pick it up." },
  { key: "picked_up", label: "Picked Up", icon: CheckCheck, description: "Enjoy your heritage meal!" },
];

function getStepIndex(status: OrderStatus, isPickup: boolean): number {
  const steps = isPickup ? PICKUP_STATUS_STEPS : STATUS_STEPS;
  const idx = steps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : 0;
}

function formatPrice(price: number) {
  return `GH₵${Number(price).toFixed(2)}`;
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString("en-GH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrderTracker({ initialOrder }: { initialOrder: OrderData }) {
  const [order, setOrder] = useState<OrderData>(initialOrder);

  const isPickup = order.fulfillment_type === "pickup";
  const steps = isPickup ? PICKUP_STATUS_STEPS : STATUS_STEPS;
  const currentStepIndex = getStepIndex(order.status, isPickup);
  const isTerminal = order.status === "delivered" || order.status === "picked_up" || order.status === "cancelled";

  useEffect(() => {
    const supabase = createClient();

    // Subscribe to realtime updates on this order
    const channel = supabase
      .channel(`order_tracking_${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          setOrder((prev) => ({ ...prev, ...payload.new } as OrderData));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [order.id]);

  // Fallback polling for live updates
  const pollUrl = `/api/orders/${order.id}`;
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    const fetchOrder = async () => {
      if (isTerminal) return;
      try {
        const res = await fetch(pollUrl, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    };

    if (!isTerminal) {
      timer = setInterval(fetchOrder, 10000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [order.id, isTerminal, pollUrl]);

  // Calculate progress line height percentage
  const progressPercent = steps.length > 1 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <PageWrapper className="bg-background text-on-background font-body min-h-[100dvh] flex flex-col pb-24 md:pb-12">
      <main className="pt-4 md:pt-12 lg:pt-16 pb-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 w-full flex-grow">
        
        {/* Mobile Header */}
        <div className="mb-2 md:hidden mt-4">
          <p className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-secondary mb-1 font-bold">Status Update</p>
          <h1 className="font-headline text-4xl font-bold text-on-surface tracking-tight">Track Your Order</h1>
        </div>

        {/* Left Column: Order Summary & Info */}
        <div className="w-full md:w-5/12 space-y-8">
          
          <section className="bg-white p-6 md:p-8 border-l-4 border-l-primary relative overflow-hidden shadow-sm border border-outline-variant/15">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#feca5a]/10 -mr-16 -mt-16 rotate-45 hidden md:block"></div>
            
            <div className="flex justify-between items-start mb-4 md:mb-1">
              <div>
                <span className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mb-2 block font-bold">Order Reference</span>
                <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-1">#{order.order_number}</h2>
              </div>
              <div className="text-right md:hidden">
                <p className="font-dm-sans text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Total</p>
                <p className="font-dm-sans font-extrabold text-xl">{formatPrice(order.total)}</p>
              </div>
            </div>

            <p className="font-dm-sans text-xs md:text-sm text-on-surface-variant mb-6 md:mb-8 font-medium">
              Placed on {formatDate(order.created_at)} • {formatTime(order.created_at)}
            </p>
            
            <div className="space-y-6 hidden md:block">
              <div className="flex items-start gap-4">
                {isPickup ? (
                  <Store size={20} className="text-primary mt-1" />
                ) : (
                  <Bike size={20} className="text-primary mt-1" />
                )}
                <div>
                  <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] text-on-surface">Fulfillment</p>
                  <p className="font-dm-sans text-sm text-on-surface-variant mt-1">
                    {isPickup ? "Pickup" : "Standard Delivery"}
                  </p>
                </div>
              </div>

              <div className="pt-6 border-t border-outline-variant/20">
                <div className="flex justify-between items-end mb-4">
                  <div className="w-full">
                    <p className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.15em] mb-3 text-on-surface">Items</p>
                    <ul className="font-dm-sans text-sm text-on-surface space-y-2 font-medium">
                      {order.order_items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <span className="w-1.5 h-1.5 bg-primary"></span>
                          {item.snapshot_name} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-outline-variant/20 flex justify-between items-center">
                <span className="font-headline text-xl font-bold">Total Amount</span>
                <span className="font-dm-sans text-2xl font-black text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Mobile Items simple text summary */}
            <div className="md:hidden space-y-1 mt-4 border-t border-outline-variant/20 pt-4 font-medium">
              <p className="font-dm-sans text-sm text-on-surface-variant leading-relaxed">
                {order.order_items.map((item) => `${item.snapshot_name} x${item.quantity}`).join(", ")}
              </p>
            </div>
          </section>

          {/* Estimated Time Banner */}
          <div className="bg-primary text-white p-5 md:p-6 flex items-center justify-between md:justify-start md:gap-6 shadow-md border-b-[5px] border-[#6b0310]">
            <div className="md:bg-white/10 md:p-3 hidden md:block">
              <Clock size={28} className="text-white" />
            </div>
            <div className="flex md:hidden items-center gap-3">
              <Clock size={20} className="text-white" />
              <span className="font-dm-sans font-bold uppercase tracking-[0.15em] text-[10px]">
                {isPickup ? "Estimated Ready" : "Estimated Delivery"}
              </span>
            </div>
            
            <div className="text-right md:text-left">
              <p className="font-dm-sans text-[10px] uppercase tracking-[0.2em] text-white/80 mb-1 hidden md:block font-bold">
                {isTerminal ? "Status: Complete" : "Status: On Track"}
              </p>
              <div className="font-headline text-xl md:text-2xl italic font-bold">
                {isTerminal ? "Complete ✓" : "25–35 min"}
              </div>
            </div>
          </div>

          {/* Desktop WhatsApp CTA */}
          <a
            href="https://wa.me/233248633aborade"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex w-full bg-[#25D366] text-white py-5 items-center justify-center gap-3 font-dm-sans font-extrabold uppercase tracking-[0.2em] hover:brightness-95 transition-all group text-[10px] shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle size={18} />
            Need help? WhatsApp us
          </a>
        </div>

        {/* Right Column: Status Timeline */}
        <div className="w-full md:w-7/12">
          <div className="bg-white border border-outline-variant/15 md:p-12 p-6 h-full shadow-sm">
            <div className="flex justify-between items-center mb-10 md:mb-12">
              <h3 className="font-headline text-2xl md:text-3xl font-bold">Live Status</h3>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary font-dm-sans text-[9px] font-bold uppercase tracking-widest border border-primary/20">
                <span className={`w-1.5 h-1.5 rounded-full bg-primary ${isTerminal ? "" : "animate-[pulse_1.5s_infinite] shadow-[0_0_8px_rgba(157,5,24,0.6)]"}`}></span>
                {isTerminal ? "Complete" : "Live Update"}
              </div>
            </div>

            <div className="relative space-y-0 pl-10 md:pl-12 pt-2 pb-4">
              {/* Vertical Line Connectors */}
              <div className="absolute left-[20px] md:left-[24px] top-4 bottom-8 w-[2px] bg-surface-container-highest"></div>
              <div
                className="absolute left-[20px] md:left-[24px] top-4 w-[2px] bg-primary transition-all duration-700"
                style={{ height: `${progressPercent}%` }}
              ></div>

              {steps.map((step, idx) => {
                const isCompleted = idx < currentStepIndex;
                const isActive = idx === currentStepIndex;
                const isFuture = idx > currentStepIndex;
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.key}
                    className={`relative flex gap-6 md:gap-8 ${idx < steps.length - 1 ? "pb-10 md:pb-12" : ""} items-start ${isFuture ? "opacity-40" : ""}`}
                  >
                    {/* Step Icon */}
                    <div
                      className={`absolute -left-[40px] md:-left-[44px] z-10 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center border-[3px] border-white ${
                        isCompleted || isActive
                          ? `bg-primary text-white ${isActive && !isTerminal ? "shadow-[0_0_0_2px_rgba(157,5,24,0.3)] animate-[pulse_2s_infinite]" : "shadow-sm outline outline-1 outline-outline-variant/20"}`
                          : "bg-surface-container text-on-surface-variant outline outline-1 outline-outline-variant/30"
                      }`}
                    >
                      {isCompleted ? (
                        <Check size={18} strokeWidth={3} />
                      ) : (
                        <StepIcon size={18} strokeWidth={2} />
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between lg:justify-start items-center gap-4 mb-1">
                        <h4
                          className={`font-dm-sans font-bold text-xs uppercase tracking-widest ${
                            isActive ? "text-primary" : isCompleted ? "text-on-surface opacity-60" : "text-on-surface-variant"
                          }`}
                        >
                          {step.label}
                        </h4>
                        <span
                          className={`font-dm-sans text-[10px] font-bold tracking-widest ${
                            isActive ? "text-primary" : isCompleted ? "text-on-surface-variant" : "text-on-surface-variant"
                          }`}
                        >
                          {isCompleted || isActive ? formatTime(isActive ? order.updated_at : order.created_at) : "--:--"}
                        </span>
                      </div>

                      {/* Description for active step */}
                      {isActive && (
                        <p className="font-headline italic text-lg md:text-xl text-on-surface">
                          {step.description}
                        </p>
                      )}

                      {/* Description for mobile on completed/future */}
                      {!isActive && (
                        <p className="font-dm-sans text-xs text-on-surface-variant md:hidden">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Map/Location Teaser Section (Desktop only, delivery orders) */}
      {!isPickup && order.delivery_address && (
        <section className="max-w-7xl mx-auto px-6 pb-24 w-full hidden md:block">
          <div className="h-[250px] w-full bg-surface-container-highest relative overflow-hidden border border-outline-variant/15 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40 z-10"></div>
            <div className="relative h-full flex flex-col justify-center px-12 z-10 w-2/3">
              <span className="font-dm-sans text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4 block">Delivery Destination</span>
              <h3 className="font-headline text-3xl font-bold text-on-surface max-w-sm leading-tight">{order.delivery_address}</h3>
            </div>
          </div>
        </section>
      )}

      {/* Mobile CTA: Sticky WhatsApp */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/90 backdrop-blur-md md:hidden z-50 border-t border-outline-variant/10 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <a
          href="https://wa.me/233248633aborade"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-[#25D366] text-white py-4 flex items-center justify-center gap-3 font-dm-sans font-extrabold uppercase tracking-[0.15em] transition-transform active:scale-95 text-xs shadow-lg shadow-[#25D366]/20"
        >
          <MessageCircle size={18} />
          WhatsApp Support
        </a>
      </div>
    </PageWrapper>
  );
}
